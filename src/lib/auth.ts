import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { env } from "@/env";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
      },
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        // TODO: remove all ads and therefore all images related to that user
      },
    },
  },
});

export const getServerAuthSession = async () =>
  await auth.api.getSession({
    headers: headers(),
  });
