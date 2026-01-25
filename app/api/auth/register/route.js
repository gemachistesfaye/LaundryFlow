export const runtime = "nodejs"; // ⚡ Force Node.js runtime

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, universityId, college, department, building, dorm, password } = body;

    // Simple validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM students WHERE email = ? LIMIT 1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const [result] = await db.query(
      "INSERT INTO students (name, phone, email, universityId, college, department, building, dorm, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, phone, email, universityId, college, department, building, dorm, hashedPassword, "student"]
    );

    // Return success
    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        universityId,
        college,
        department,
        building,
        dorm,
        role: "student",
      },
    }, { status: 201 });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Server error during registration" }, { status: 500 });
  }
}
