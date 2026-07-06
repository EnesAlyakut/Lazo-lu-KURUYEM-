import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";

// Load .env variables
try {
  const envConfig = fs.readFileSync(".env", "utf8");
  envConfig.split("\n").forEach(line => {
    if (!line || line.startsWith("#")) return;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
} catch(e) {
  console.log("No .env file found or error reading it.");
}

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("31697286fk", 12);
  
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: "admin",
        password: hashedPassword,
      }
    });
    console.log("Admin user updated successfully.");
  } else {
    await prisma.user.create({
      data: {
        email: "admin",
        password: hashedPassword,
        name: "FK Admin",
        role: "ADMIN"
      }
    });
    console.log("Admin user created successfully.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
