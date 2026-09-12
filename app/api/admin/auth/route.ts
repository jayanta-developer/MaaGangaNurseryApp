import { NextResponse } from "next/server";
import { cookieName, createSession, isValidPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !isValidPassword(body.password)) {
    return NextResponse.json({ message: "Incorrect admin password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(cookieName, createSession(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8, path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(cookieName);
  return response;
}