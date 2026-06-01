// Shared-password admin auth. The admin password lives only on the server
// (ADMIN_PASSWORD). On login we set an httpOnly cookie to the SHA-256 of the
// password (+ a fixed salt); middleware re-derives the same value and compares.
// The plaintext password is never sent to the client.

export const COOKIE_NAME = "findwell-admin";

const SALT = "findwell-admin-v1";

export async function sessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD");
  }
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time-ish comparison to avoid trivially leaking length/prefix.
export function tokensMatch(a: string | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
