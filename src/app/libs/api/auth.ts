const API_URL = process.env.NEXT_PUBLIC_API;

export async function loginUser(
  credentials: Record<"password" | "username", string>,
) {
  const res = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  const user = await res.json();
  if (!res.ok) {
    throw new Error(user?.error || "Something went wrong");
  }
  return user;
}
export async function refreshToken(refresh_token: string) {
  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    body: JSON.stringify({ refresh: refresh_token }),
    headers: { "Content-Type": "application/json" },
  });

  return res;
}

export async function registerUser(
  credentials: Record<
    "first_name" | "last_name" | "email" | "password" | "username",
    string
  >,
) {
  const res = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  const user = await res.json();
  if (!res.ok) {
    throw Object.values(user as { [k: string]: string[] })[0]?.[0] as any;
  }
  return user;
}
