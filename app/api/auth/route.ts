import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, buildSessionCookie, clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json()) as { password?: string };
    if (!password || !checkPassword(password)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const c = buildSessionCookie();
    cookies().set(c.name, c.value, {
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite,
      path: c.path,
      maxAge: c.maxAge,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE() {
  const c = clearSessionCookie();
  cookies().set(c.name, c.value, { path: c.path, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
