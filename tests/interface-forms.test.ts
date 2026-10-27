import test from "node:test";
import assert from "node:assert/strict";
import { validateAccountForm } from "../src/account-form.ts";
import { sharedLessonErrorMessage } from "../src/session-messages.ts";

test("account forms validate required fields and email before submitting", () => {
  assert.deepEqual(Object.keys(validateAccountForm("", "", false)), ["email", "password"]);
  assert.ok(validateAccountForm("not-an-email", "password", false).email);
  assert.deepEqual(validateAccountForm(" teacher@example.com ", "a", false), {});
  assert.ok(validateAccountForm("teacher@example.com", "short", true).password);
  assert.deepEqual(validateAccountForm("teacher@example.com", "ten letters", true), {});
});

test("shared lesson errors explain recovery without exposing raw server messages", () => {
  assert.match(sharedLessonErrorMessage(403), /full link/);
  assert.match(sharedLessonErrorMessage(429), /wait/);
  assert.match(sharedLessonErrorMessage(429, "Daily session creation limit reached. Reuse an existing lesson link."), /existing lesson link/);
  assert.match(sharedLessonErrorMessage(403, "Only the teacher can review answers."), /teacher can mark/);
  assert.match(sharedLessonErrorMessage(400, "Invalid answer. Use at most 8000 characters per field."), /8,000 characters/);
  assert.equal(sharedLessonErrorMessage(500, "Unexpected database detail"), sharedLessonErrorMessage(500));
  assert.equal(sharedLessonErrorMessage(400, "Внутренняя ошибка"), sharedLessonErrorMessage(400));
});
