// Shared public Web3Forms form ID: careers and contact reach the same inbox.
const WEB3FORMS_KEY = "b1d6246c-dfe6-41f6-8c93-7374d0c9919c";

export async function submitContact(payload, request = fetch) {
  const response = await request("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, access_key: WEB3FORMS_KEY }),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true)
    throw new Error(result.message || "Submission failed");
}
