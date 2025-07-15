import { type Prisma } from "@prisma/client";
import { db } from "@/server/db";

/**
 * Get accepted ads from non-banned users (deletedAt is null, user not banned, adStatus is ACCEPTED)
 * @param options - Prisma query options (where, include, select, orderBy, etc.)
 * @returns Promise<Ad[]> or null if error occurs
 */
export const getAcceptedAdsFromNonBannedUsers = async <
  T extends Prisma.AdFindManyArgs,
>(
  options?: Omit<T, "where"> & {
    where?: Omit<Prisma.AdWhereInput, "deletedAt" | "adStatus" | "user">;
  },
) => {
  try {
    const { where: customWhere, ...otherOptions } = options || {};

    const ads = await db.ad.findMany({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        adStatus: "ACCEPTED", // Only accepted ads
        user: {
          OR: [{ banned: null }, { banned: false }],
        }, // Ensure user is not banned
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
 * Get a single accepted ad from non-banned user by ID
 * @param id - Ad ID
 * @param options - Additional Prisma query options (include, select)
 * @returns Promise<Ad> or null if not found or error occurs
 */
export const getAcceptedAdFromNonBannedUserById = async <
  T extends Prisma.AdFindUniqueArgs,
>(
  id: string,
  options?: Omit<T, "where">,
) => {
  try {
    const ad = await db.ad.findUnique({
      where: {
        id,
        deletedAt: null, // Ensure ad is not deleted
        adStatus: "ACCEPTED", // Only accepted ads
        user: {
          OR: [{ banned: null }, { banned: false }],
        }, // Ensure user is not banned
      },
      ...options, // Include other query options like include, select
    } as T);

    return ad;
  } catch (error) {
    return null;
  }
};

/**
 * Get first accepted ad from non-banned users that matches the criteria
 * @param options - Prisma query options (where, include, select, orderBy)
 * @returns Promise<Ad> or null if not found or error occurs
 */
export const findFirstAcceptedAdFromNonBannedUser = async <
  T extends Prisma.AdFindFirstArgs,
>(
  options?: Omit<T, "where"> & {
    where?: Omit<Prisma.AdWhereInput, "deletedAt" | "adStatus" | "user">;
  },
) => {
  try {
    const { where: customWhere, ...otherOptions } = options || {};

    const ad = await db.ad.findFirst({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        adStatus: "ACCEPTED", // Only accepted ads
        user: {
          OR: [{ banned: null }, { banned: false }],
        }, // Ensure user is not banned
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
 * Count accepted ads from non-banned users that match the criteria
 * @param where - Custom where conditions (deletedAt: null, adStatus: ACCEPTED, user not banned are automatically added)
 * @returns Promise<number> or null if error occurs
 */
export const countAcceptedAdsFromNonBannedUsers = async (
  where?: Omit<Prisma.AdWhereInput, "deletedAt" | "adStatus" | "user">,
) => {
  try {
    const count = await db.ad.count({
      where: {
        deletedAt: null, // Ensure ad is not deleted
        adStatus: "ACCEPTED", // Only accepted ads
        user: {
          OR: [{ banned: null }, { banned: false }],
        }, // Ensure user is not banned
        ...where, // Merge with custom where conditions
      },
    });

    return count;
  } catch (error) {
    return null;
  }
};
