import test from "node:test";
import assert from "node:assert/strict";
import { submitContact } from "./submitContact.mjs";
const payload = {
  name: "Test",
  email: "test@example.com",
  message: "A local test only",
};
test("confirmed delivery resolves and sends JSON", async () => {
  let request;
  await submitContact(payload, async (url, options) => {
    request = { url, ...options };
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(request.url, "https://api.web3forms.com/submit");
  assert.deepEqual(JSON.parse(request.body), payload);
});
test("API rejection never resolves as success", async () => {
  await assert.rejects(
    submitContact(payload, async () => ({
      ok: true,
      json: async () => ({ success: false }),
    })),
    /Submission failed/,
  );
});
test("HTTP error with success body still rejects", async () => {
  await assert.rejects(
    submitContact(payload, async () => ({
      ok: false,
      json: async () => ({ success: true }),
    })),
    /Submission failed/,
  );
});
test("network error is propagated without changing user data", async () => {
  const original = { ...payload };
  await assert.rejects(
    submitContact(payload, async () => {
      throw Error("Offline");
    }),
    /Offline/,
  );
  assert.deepEqual(payload, original);
});
