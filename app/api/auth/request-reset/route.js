import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { genOtp } from "@/lib/otp";
import { sendEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Missing email" }, { status: 400 });

    const [rows] = await db.query("SELECT id, name FROM students WHERE email = ?", [email]);
    if (rows.length === 0) {
      // Don't reveal existence — respond same as success
      return NextResponse.json({ message: "If the email exists, a reset code was sent." });
    }

    const user = rows[0];
    const otp = genOtp(6);
    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await db.query("UPDATE students SET reset_otp = ?, reset_expires = ? WHERE id = ?", [otp, expires, user.id]);

    try {
      await sendEmail({
        to: email,
        subject: "SmartWash password reset code",
        html: `<p>Hello ${user.name},</p><p>Your reset code is <strong>${otp}</strong>. Expires in 15 minutes.</p>`,
        text: `Reset code: ${otp}`
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return NextResponse.json({ message: "If the email exists, a reset code was sent." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
