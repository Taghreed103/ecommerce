const baseUrl = "https://ecommerce.routemisr.com/api/v1/auth";

export async function forgotPassword(email: string) {
  const res = await fetch(`${baseUrl}/forgotPasswords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function verifyResetCode(email: string, resetCode: string) {
  const res = await fetch(`${baseUrl}/verifyResetCode`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, resetCode })
  });
  return res.json();
}

export async function resetPassword(email: string, newPassword: string) {
  const res = await fetch(`${baseUrl}/resetPassword`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  });
  return res.json();
}
