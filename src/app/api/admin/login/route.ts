import { NextResponse } from "next/server";
import { COOKIE_NAME, sessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  let password: string | undefined;
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : undefined;
  } catch {
    password = undefined;
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, await sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  return response;
}
