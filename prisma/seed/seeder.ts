import { db } from "@/server/db";
import { seedCategories } from "./categoriesSeeder";
import { seedLocations } from "./locationsSeeder";

async function main() {
    seedCategories();
    seedLocations();
}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })