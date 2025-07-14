import { type Prisma } from "@prisma/client";
import { db } from "@/server/db";

/**
 * Get ads that are not deleted (deletedAt is null) with customizable query options
 * @param options - Prisma query options (where, include, select, orderBy, etc.)
 * @returns Promise<Ad[]> or null if error occurs
 */
export const getNonDeletedAds = async <T extends Prisma.AdFindManyArgs>(
  options?: Omit<T, "where"> & {
    where?: Omit<Prisma.AdWhereInput, "deletedAt">;
  },
) => {
  try {
    const { where: customWhere, ...otherOptions } = options || {};

    const ads = await db.ad.findMany({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        ...customWhere, // Merge with custom where conditions
      },
      ...otherOptions, // Include other query options like include, select, orderBy, etc.
    } as T);

    return ads;
  } catch (error) {
    return null;
  }
};

/**
 * Get a single non-deleted ad by ID
 * @param id - Ad ID
 * @param options - Additional Prisma query options (include, select)
 * @returns Promise<Ad> or null if not found or error occurs
 */
export const getNonDeletedAdById = async <T extends Prisma.AdFindUniqueArgs>(
  id: string,
  options?: Omit<T, "where">,
) => {
  try {
    const ad = await db.ad.findUnique({
      where: {
        id,
        deletedAt: null, // Ensure ad is not deleted
      },
      ...options, // Include other query options like include, select
    } as T);

    return ad;
  } catch (error) {
    return null;
  }
};

/**
 * Get first non-deleted ad that matches the criteria
 * @param options - Prisma query options (where, include, select, orderBy)
 * @returns Promise<Ad> or null if not found or error occurs
 */
export const findFirstNonDeletedAd = async <T extends Prisma.AdFindFirstArgs>(
  options?: Omit<T, "where"> & {
    where?: Omit<Prisma.AdWhereInput, "deletedAt">;
  },
) => {
  try {
    const { where: customWhere, ...otherOptions } = options || {};

    const ad = await db.ad.findFirst({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        ...customWhere, // Merge with custom where conditions
      },
      ...otherOptions, // Include other query options like include, select, orderBy
    } as T);

    return ad;
  } catch (error) {
    return null;
  }
};

/**
 * Count non-deleted ads that match the criteria
 * @param where - Custom where conditions (deletedAt: null is automatically added)
 * @returns Promise<number> or null if error occurs
 */
export const countNonDeletedAds = async (
  where?: Omit<Prisma.AdWhereInput, "deletedAt">,
) => {
  try {
    const count = await db.ad.count({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        ...where, // Merge with custom where conditions
      },
    });

    return count;
  } catch (error) {
    return null;
  }
};
