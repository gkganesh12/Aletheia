export function referralFromLink(value) {
  const code = (value || "").trim().toUpperCase();
  return /^[A-Z0-9_-]{1,40}$/.test(code) ? code : "";
}

export function careerApplicationPayload(jobTitle, data) {
  const referral = referralFromLink(data.referralCode);
  return {
    subject: `Job Application: ${jobTitle} — ${data.name}${referral ? ` [Ref: ${referral}]` : ""}`,
    from_name: data.name,
    name: data.name,
    email: data.email,
    phone: data.phone || "Not provided",
    portfolio: data.portfolio || "Not provided",
    position: jobTitle,
    referral_code: referral || "Not provided",
    message: data.message,
  };
}
