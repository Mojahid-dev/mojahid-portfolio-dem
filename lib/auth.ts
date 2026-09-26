import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const cookieName = "portfolio_admin";
function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}
function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
export function passwordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}
export async function isAdmin() {
  if (!passwordConfigured()) return false;
  const value = (await cookies()).get(cookieName)?.value ?? "";
  const [payload, supplied] = value.split(".");
  if (payload !== "admin" || !supplied) return false;
  const expected = signature(payload);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function makeSession() {
  return `admin.${signature("admin")}`;
}
export const adminCookieName = cookieName;
