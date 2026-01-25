// /lib/auth.js
import { verifyToken } from "./jwt";
import { db } from "./db";

export async function getUserFromAuthHeader(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.split(" ")[1];
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const [rows] = await db.query("SELECT id, name, email, role, building, dorm, phone, image_url, is_verified FROM students WHERE id = ?", [payload.id]);
  return rows[0] || null;
}
