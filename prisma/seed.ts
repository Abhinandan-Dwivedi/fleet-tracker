import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
   
  const company = await prisma.company.create({
    data: {
      name: "Acme Logistics",
    },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Dispatcher account
  await prisma.user.create({
    data: {
      email: "dispatcher@acme.com",
      password: hashedPassword,
      name: "Dana Dispatcher",
      role: Role.DISPATCHER,
      companyId: company.id,
    },
  });

  // Fleet manager account
  await prisma.user.create({
    data: {
      email: "manager@acme.com",
      password: hashedPassword,
      name: "Fiona Manager",
      role: Role.FLEET_MANAGER,
      companyId: company.id,
    },
  });

  // Customer account
  await prisma.user.create({
    data: {
      email: "customer@acme.com",
      password: hashedPassword,
      name: "Chris Customer",
      role: Role.CUSTOMER,
      companyId: company.id,
    },
  });

  console.log("✅ Seed data created successfully");
  console.log("Company:", company.name);
  console.log("Login with any of these (password: password123):");
  console.log("- dispatcher@acme.com");
  console.log("- manager@acme.com");
  console.log("- customer@acme.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });