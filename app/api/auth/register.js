export const runtime = "nodejs"; // Node runtime required for MySQL & bcrypt

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      universityId,
      college,
      department,
      building,
      dorm,
      password,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if student already exists
    const [existing] = await db.query(
      "SELECT * FROM students WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student into MySQL
    const [result] = await db.query(
      `INSERT INTO students 
        (name, phone, email, universityId, college, department, building, dorm, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, universityId, college, department, building, dorm, hashedPassword, "student"]
    );

    return NextResponse.json(
      {
        message: "Student registered successfully",
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
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { message: "Server error during registration" },
      { status: 500 }
    );
  }
}
