export async function submitContact(payload, request = fetch) {
  const response = await request("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true)
    throw new Error(result.message || "Submission failed");
}
