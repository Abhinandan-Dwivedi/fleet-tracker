import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Driver role isolation", () => {
  let companyA: { id: string };
  let companyB: { id: string };
  let driverInCompanyA: { id: string };

  beforeAll(async () => {
    companyA = await prisma.company.create({ data: { name: "Test Company A" } });
    companyB = await prisma.company.create({ data: { name: "Test Company B" } });

    driverInCompanyA = await prisma.driver.create({
      data: {
        name: "Test Driver",
        phone: "1234567890",
        companyId: companyA.id,
      },
    });
  });

  afterAll(async () => {
  if (companyA?.id && companyB?.id) {
    await prisma.driver.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.company.deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } });
  }
});

  it("finds a driver when queried with the correct companyId", async () => {
    const result = await prisma.driver.findFirst({
      where: { id: driverInCompanyA.id, companyId: companyA.id },
    });

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Test Driver");
  });

  it("returns null when queried with a different company's ID — proving isolation", async () => {
    const result = await prisma.driver.findFirst({
      where: { id: driverInCompanyA.id, companyId: companyB.id },
    });

    expect(result).toBeNull();
  });
});