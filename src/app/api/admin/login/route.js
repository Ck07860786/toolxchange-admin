import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  const admin = await Admin.findOne({ email });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ role: "admin", email });

  const cookieSerialized = cookie.serialize("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
    sameSite: "lax",
  });

  const response = NextResponse.json({ message: "Login successful" });
  response.headers.set("Set-Cookie", cookieSerialized);
  return response;
}
