import { cities } from '@/schema/cities';
import { governorates } from '@/schema/governorates';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function seedLocations() {
    for (const governorate of governorates) {
        await prisma.governorate.upsert({
            where: { id: governorate.id },
            update: {},
            create: {
                id: governorate.id,
                governorate_name_ar: governorate.governorate_name_ar,
                governorate_name_en: governorate.governorate_name_en
            }
        });
    }

    for (const city of cities) {
        await prisma.city.create({
            data: {
                governorate_id: city.governorate_id,
                city_name_ar: city.city_name_ar,
                city_name_en: city.city_name_en
            }
        });
    }
}