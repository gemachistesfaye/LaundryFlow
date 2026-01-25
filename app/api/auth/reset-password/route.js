import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) return NextResponse.json({ message: "Missing" }, { status: 400 });

    const [rows] = await db.query("SELECT id, reset_expires FROM students WHERE email = ? AND reset_otp = ?", [email, otp]);
    if (rows.length === 0) return NextResponse.json({ message: "Invalid code" }, { status: 400 });

    const user = rows[0];
    if (new Date(user.reset_expires) < new Date()) return NextResponse.json({ message: "Code expired" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE students SET password = ?, reset_otp = NULL, reset_expires = NULL WHERE id = ?", [hashed, user.id]);

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
