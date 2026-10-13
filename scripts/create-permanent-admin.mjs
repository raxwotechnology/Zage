import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex !== -1) {
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  const users = mongoose.connection.db.collection("users");

  const email = "salonzage@gmail.com".toLowerCase().trim();
  const password = "Zage@1211";
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await users.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Zage Admin",
        email,
        phone: "+94770000000",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        mustChangePassword: false,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        profileImage: "",
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  console.log("Permanent admin created/updated successfully!");
  console.log("Email:", email);
  console.log("Role:", result.role);
  console.log("mustChangePassword:", result.mustChangePassword);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
