import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const account = await prisma.salonAccount.findUnique({
    where: { loginToken: token },
  });

  if (!account) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  if (account.tokenExpiry && account.tokenExpiry < new Date()) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, salonId: account.salonId });

  response.cookies.set("whim_salon_id", String(account.salonId), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });

  response.cookies.set("whim_salon_token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}
