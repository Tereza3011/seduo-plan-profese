import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createServer } from "vite";

test("different professions receive distinct skill-based course plans", async () => {
  const vite = await createServer({
    configFile: false,
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const { findProfile, chooseCourses } = await vite.ssrLoadModule("/app/page.tsx");
    const roles = {
      "HR specialista": "hr",
      "Obchodní zástupce": "sales",
      "Mistr výroby": "production",
      "Projektový manažer": "project",
      "Finanční analytik": "analyst",
      "IT specialista": "it",
      "Marketingový specialista": "marketing",
    };

    const plans = Object.entries(roles).map(([role, expectedProfile]) => {
      const profile = findProfile(role);
      assert.equal(profile.key, expectedProfile, `${role} has the right professional profile`);

      const courses = chooseCourses(profile.key, "medior");
      assert.equal(courses.length, 12, `${role} receives twelve verified courses`);
      assert.equal(new Set(courses.map((course) => course.id)).size, 12);
      return { role, ids: courses.map((course) => course.id) };
    });

    for (let index = 0; index < plans.length; index += 1) {
      for (let compared = index + 1; compared < plans.length; compared += 1) {
        assert.notDeepEqual(
          plans[index].ids.slice(0, 5),
          plans[compared].ids.slice(0, 5),
          `${plans[index].role} and ${plans[compared].role} have distinct main recommendations`,
        );
      }
    }
  } finally {
    await vite.close();
  }
});

test("seniority changes the recommended leadership plan", async () => {
  const vite = await createServer({
    configFile: false,
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const { chooseCourses } = await vite.ssrLoadModule("/app/page.tsx");
    const junior = chooseCourses("manager", "junior");
    const medior = chooseCourses("manager", "medior");
    const senior = chooseCourses("manager", "senior");

    for (const courses of [junior, medior, senior]) {
      assert.equal(courses.length, 12);
      assert.equal(new Set(courses.map((course) => course.id)).size, 12);
    }

    assert.notDeepEqual(junior.slice(0, 5).map((course) => course.id), medior.slice(0, 5).map((course) => course.id));
    assert.notDeepEqual(medior.slice(0, 5).map((course) => course.id), senior.slice(0, 5).map((course) => course.id));
    assert.notDeepEqual(junior.map((course) => course.id), senior.map((course) => course.id));

    assert.ok(junior.slice(0, 5).some((course) => course.id === "leader-start"));
    assert.ok(senior.slice(0, 3).some((course) => course.id === "leadership-max"));
    assert.ok(
      senior.findIndex((course) => course.id === "leadership-max") <
        junior.findIndex((course) => course.id === "leadership-max"),
    );
  } finally {
    await vite.close();
  }
});

test("every professional profile receives five verified microlearning lessons", async () => {
  const vite = await createServer({
    configFile: false,
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const { chooseMicrolearning } = await vite.ssrLoadModule("/app/page.tsx");
    const profileKeys = ["manager", "project", "production", "hr", "ld", "sales", "it", "marketing", "assistant", "operations"];

    for (const profileKey of profileKeys) {
      const lessons = chooseMicrolearning(profileKey);
      assert.equal(lessons.length, 5, `${profileKey} receives a five-day microlearning selection`);
      assert.equal(new Set(lessons.map((lesson) => lesson.title)).size, 5);
    }

    assert.ok(
      chooseMicrolearning("ld").some((lesson) => lesson.title === "Jak si správně říct o pomoc"),
    );
  } finally {
    await vite.close();
  }
});

test("draft role and seniority update the plan only after form submission", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const submitHandler = source.slice(
    source.indexOf("function submit("),
    source.indexOf("function selectRole("),
  );
  const roleHandler = source.slice(
    source.indexOf("function selectRole("),
    source.indexOf("const seniorityLabel"),
  );

  assert.match(submitHandler, /setPlanSelection/);
  assert.match(submitHandler, /draftRole\.trim\(\)/);
  assert.match(submitHandler, /draftSeniority/);
  assert.doesNotMatch(roleHandler, /setPlanSelection|setActiveTab/);
});
