export const runtime = "nodejs"; // Force Node runtime

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // Find student by email
    const [rows] = await db.query(
      "SELECT * FROM students WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No account found. Please register first." },
        { status: 404 }
      );
    }

    const student = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role: student.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          universityId: student.universityId,
          college: student.college,
          department: student.department,
          building: student.building,
          dorm: student.dorm,
          role: student.role.toLowerCase(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Server error during login" },
      { status: 500 }
    );
  }
}
