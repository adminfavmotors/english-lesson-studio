import test from "node:test";
import assert from "node:assert/strict";
import { APP_LANGUAGE, APP_LOCALE, normaliseSearchText } from "../src/app-language.ts";

test("English display and search use the product locale", () => {
  assert.equal(APP_LANGUAGE, "en");
  const day = new Date("2026-10-27T12:00:00Z");
  assert.equal(new Intl.DateTimeFormat(APP_LOCALE, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(day), "27 October 2026");
  // Turkish casing would turn I into a dotless ı and lose an English match.
  assert.notEqual("I LIKE".toLocaleLowerCase("tr-TR"), normaliseSearchText("I LIKE"));
  assert.ok(normaliseSearchText("I LIKE ENGLISH").includes(normaliseSearchText("i like")));
});
