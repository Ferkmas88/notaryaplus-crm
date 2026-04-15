import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "notaryaplus_auth";
const SESSION_HOURS = 24 * 7; // 7 dias

function getSecret(): string {
  return process.env.COOKIE_SECRET || "dev-secret-change-me";
}

export function sign(value: string): string {
  const h = crypto.createHmac("sha256", getSecret()).update(value).digest("hex").slice(0, 16);
  return `${value}.${h}`;
}

export function verify(signed: string): boolean {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return false;
  const value = signed.slice(0, idx);
  const hash = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(value).digest("hex").slice(0, 16);
  return hash === expected && parseInt(value, 10) + SESSION_HOURS * 3600 * 1000 > Date.now();
}

export function isAuthed(): boolean {
  const c = cookies().get(COOKIE_NAME);
  if (!c) return false;
  return verify(c.value);
}

export function buildSessionCookie() {
  const token = sign(String(Date.now()));
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  };
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: "", path: "/", maxAge: 0 };
}

export function checkPassword(input: string): boolean {
  const expected = (process.env.DASHBOARD_PASSWORD || "").trim();
  const cleaned = (input || "").trim();
  if (!expected) return false;
  // constant-time compare
  const a = Buffer.from(cleaned);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
