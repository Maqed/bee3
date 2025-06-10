import { cities } from "@/schema/cities";
import { governorates } from "@/schema/governorates";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedLocations() {
  for (const governorate of governorates) {
    await prisma.governorate.upsert({
      where: { id: governorate.id },
      update: {},
      create: {
        ...governorate,
      },
    });
  }

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: {
        ...city,
      },
    });
  }
}
