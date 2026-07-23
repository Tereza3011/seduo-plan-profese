import assert from "node:assert/strict";
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
