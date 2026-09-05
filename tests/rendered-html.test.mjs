import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Seduo planning assistant", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Seduo Plán \| Ověřený vzdělávací plán<\/title>/i);
  assert.match(html, /Vzdělávací plán/);
  assert.match(html, /Ověřený katalog/);
  assert.match(html, /L&amp;D specialista/);
  assert.match(html, /Hlavní doporučené videokurzy/);
  assert.match(html, /Vedlejší vhodné kurzy/);
  assert.match(html, /Microlearning/);
  assert.match(html, /Akademie/);
  assert.match(html, /Webináře/);
  assert.match(html, /Podcasty/);
  assert.match(html, /Generální ředitel/);
  assert.match(html, /Zobrazit výběr profesí/);
  assert.match(html, /400\+/);
  assert.match(html, /300\+/);
  assert.match(html, /Videokurzy<b>12<\/b>/);
  assert.match(html, /Microlearning<b>4<\/b>/);
  assert.match(html, /Maxikurz umělé inteligence: kompletní průvodce AI světem/);
  assert.match(html, /95 % · 462 hodnocení/);
  assert.match(html, /Jednoduchá 6měsíční vzdělávací cesta/);
  assert.match(html, /Wellbeing a odolnost/);
  assert.match(html, /Komunikační sebeobrana: reagujte pohotově v každé situaci/);
  assert.match(html, /TOP 1 · KVĚTEN 2026/);
  assert.match(html, /Formáty a zdroje Seduo/);
  assert.match(html, /Průvodce Seduo pro nové uživatele/);
  assert.match(html, /ZAČÍNÁTE SE SEDUO\?/);
  assert.match(html, /href="https:\/\/www\.seduo\.cz\/kategorie\/hr-pravo"/);
  assert.match(html, /href="https:\/\/www\.seduo\.cz\/kategorie\/leadership"/);
  assert.match(html, /href="https:\/\/www\.seduo\.cz\/kategorie\/komunikace"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("ships only safe Seduo destinations in the initial render", async () => {
  const response = await render();
  const html = await response.text();
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
  const external = hrefs.filter((href) => /^https?:\/\//.test(href));

  assert.ok(external.length > 0);
  assert.ok(external.every((href) =>
    href.startsWith("https://www.seduo.cz/") ||
    href === "https://www.loom.com/share/6ffda844578343cd805457c6ba90b5e1"
  ));
  assert.doesNotMatch(html, /example\.com|seduo\.cz\/kurz-[^"]*odhad/i);
});
