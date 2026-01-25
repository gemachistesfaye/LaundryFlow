import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

async function getUserFromToken(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const [rows] = await db.query("SELECT id, name, email, role, building, dorm, phone, image_url, is_verified FROM students WHERE id = ?", [payload.id]);
  return rows[0] || null;
}

export async function GET(req) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(req) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, building, dorm, image_url } = body;

  await db.query(
    "UPDATE students SET name = ?, phone = ?, building = ?, dorm = ?, image_url = ? WHERE id = ?",
    [name || user.name, phone || user.phone, building || user.building, dorm || user.dorm, image_url || user.image_url, user.id]
  );

  const [rows] = await db.query("SELECT id, name, email, role, building, dorm, phone, image_url, is_verified FROM students WHERE id = ?", [user.id]);
  return NextResponse.json({ user: rows[0] });
}
