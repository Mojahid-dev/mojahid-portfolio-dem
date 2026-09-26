import { NextResponse } from "next/server";
import { adminCookieName, makeSession, passwordConfigured } from "@/lib/auth";
export async function POST(request: Request) {
  if (!passwordConfigured()) return NextResponse.json({ error: "Set ADMIN_PASSWORD in .env.local first." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.password !== "string" || body.password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "That password did not match." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, makeSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
