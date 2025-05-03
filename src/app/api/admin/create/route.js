import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

export async function POST(req) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { email, password } = body;

  

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password:passwordHash });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
