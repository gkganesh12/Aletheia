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
  const sent = JSON.parse(request.body);
  const { access_key, ...fields } = sent;
  assert.equal(access_key, "b1d6246c-dfe6-41f6-8c93-7374d0c9919c");
  assert.deepEqual(fields, payload);
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

test("career applications and contact inquiries use the same destination and retain routing details", async () => {
  const sent = [];
  const request = async (url, options) => {
    sent.push({ url, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ success: true }) };
  };
  const application = {
    ...payload,
    subject: "Job Application: AI Intern — Test",
    position: "AI Intern",
    portfolio: "https://example.com/cv",
  };
  await submitContact(application, request);
  await submitContact(
    { ...payload, subject: "New inquiry", service: "Other" },
    request,
  );
  assert.equal(sent[0].url, sent[1].url);
  assert.ok(sent[0].body.access_key);
  assert.equal(sent[0].body.access_key, sent[1].body.access_key);
  assert.equal(sent[0].body.position, application.position);
  assert.equal(sent[0].body.subject, application.subject);
  assert.equal(sent[0].body.portfolio, application.portfolio);
});
