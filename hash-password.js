// hash-password.js
import bcrypt from "bcryptjs";

async function generateHash() {
  const passwords = [
    "admin123",
    "coord123",
    "worker123",
    "worker234",
    "worker235",
    "deliver123",
    "deliver234"
  ];

  for (let pwd of passwords) {
    const hashed = await bcrypt.hash(pwd, 10);
    console.log(`${pwd} => ${hashed}`);
  }
}

generateHash();
