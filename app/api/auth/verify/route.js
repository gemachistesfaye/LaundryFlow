import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ message: "Missing" }, { status: 400 });

    const [rows] = await db.query("SELECT id, otp_expires FROM students WHERE email = ? AND email_otp = ?", [email, otp]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Invalid code" }, { status: 400 });
    }

    const user = rows[0];
    const now = new Date();
    if (new Date(user.otp_expires) < now) {
      return NextResponse.json({ message: "Code expired" }, { status: 400 });
    }

    await db.query("UPDATE students SET is_verified = 1, email_otp = NULL, otp_expires = NULL WHERE id = ?", [user.id]);

    return NextResponse.json({ message: "Email verified" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
