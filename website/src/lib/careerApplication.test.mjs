import test from "node:test";
import assert from "node:assert/strict";
import {
  referralFromLink,
  careerApplicationPayload,
} from "./careerApplication.mjs";

test("referral links accept shareable codes but reject malformed or oversized values", () => {
  assert.equal(referralFromLink(" team-gk_01 "), "TEAM-GK_01");
  assert.equal(referralFromLink(null), "");
  assert.equal(referralFromLink("<script>"), "");
  assert.equal(referralFromLink("A".repeat(41)), "");
});

test("applications carry the chosen role and referral in the inbox payload", () => {
  const result = careerApplicationPayload("AI Intern", {
    name: "Test Applicant",
    email: "test@example.com",
    message: "An application message",
    portfolio: "https://example.com/cv",
    referralCode: "team-gk",
  });
  assert.equal(result.position, "AI Intern");
  assert.equal(result.referral_code, "TEAM-GK");
  assert.match(result.subject, /AI Intern.*Ref: TEAM-GK/);
  assert.equal(result.portfolio, "https://example.com/cv");
  assert.equal(result.email, "test@example.com");
});

test("referral is optional and does not prevent a direct application", () => {
  const result = careerApplicationPayload("Software Engineer", {
    name: "Test",
    email: "test@example.com",
    message: "An application message",
  });
  assert.equal(result.referral_code, "Not provided");
  assert.doesNotMatch(result.subject, /Ref:/);
});
