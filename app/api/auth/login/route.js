export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const tables = [
  { name: "admins", role: "Admin" },
  { name: "coordinators", role: "Coordinator" },
  { name: "workers", role: "Worker" },
  { name: "deliverers", role: "Deliverer" },
  { name: "students", role: "Student" },
];

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    let user = null;
    let userRole = null;

    // Find user in all tables
    for (let t of tables) {
      const [rows] = await db.query(`SELECT * FROM ${t.name} WHERE email = ? LIMIT 1`, [email]);
      if (rows.length > 0) {
        user = rows[0];
        userRole = t.role;
        break;
      }
    }

    if (!user) {
      return NextResponse.json({ message: "No account found. Please register first." }, { status: 404 });
    }

    // Demo / manual login: check password plain text
    const isDemoUser = ["admin@smartwash.edu","coordinator@smartwash.edu","worker1@smartwash.edu","worker2@smartwash.edu","worker3@smartwash.edu","deliverer1@smartwash.edu","deliverer2@smartwash.edu"].includes(email);

    let isMatch = false;
    if (isDemoUser) {
      isMatch = user.password === password; // Plain text check for demo
    } else {
      isMatch = await bcrypt.compare(password, user.password); // Real hashed passwords
    }

    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userRole.toLowerCase(),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ message: "Server error during login" }, { status: 500 });
  }
}
