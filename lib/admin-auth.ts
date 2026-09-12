import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "maa-ganga-admin";

function signature(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "change-me").update(value).digest("hex");
}

export function isValidPassword(password: string) {
  return Boolean(process.env.ADMIN_PASSWORD) && password === process.env.ADMIN_PASSWORD;
}

export function createSession() {
  const value = "admin";
  return `${value}.${signature(value)}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value ?? "";
  const [value, providedSignature] = token.split(".");
  if (!value || !providedSignature) return false;
  const expected = signature(value);
  return value === "admin" && providedSignature.length === expected.length && timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expected));
}

export { cookieName };