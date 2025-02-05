import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { env } from "@/env";
import { headers } from "next/headers";
import { AdTiers } from "@prisma/client";
import { phoneNumber } from "better-auth/plugins";
import { toPathFormat } from "./utils";
import { createId } from "@paralleldrive/cuid2";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              id: `${toPathFormat(user.name)
                .toLowerCase()
                .trim()
                .replace(/[^\u0600-\u06FFa-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")}-${createId()}`,
            },
          };
        },
        after: async (user) => {
          const getRefreshTime = (days: number) => {
            const date = new Date(Date.now());
            date.setDate(date.getDate() + days);
            return date;
          };
          await db.user.update({
            where: { id: user.id },
            data: {
              tokensStorage: {
                createMany: {
                  data: [
                    {
                      tokenType: AdTiers.Free,
                      initialCount: 20,
                      count: 20,
                      refreshInDays: 7,
                      nextRefreshTime: getRefreshTime(7),
                    },
                    {
                      tokenType: AdTiers.Pro,
                      initialCount: 3,
                      count: 3,
                      refreshInDays: 0,
                      nextRefreshTime: new Date(0),
                    },
                    {
                      tokenType: AdTiers.Expert,
                      initialCount: 1,
                      count: 1,
                      refreshInDays: 0,
                      nextRefreshTime: new Date(0),
                    },
                  ],
                },
              },
            },
          });
        },
      },
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
      },
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {
        // TODO: Implement sending OTP code via Whatsapp
      },
      callbackOnVerification: async ({ phoneNumber }, request) => {
        // TODO: check for a better approach...
        const session = await getServerAuthSession();
        if (!session || !session.user.id) {
          throw new APIError("UNAUTHORIZED");
        }
        if (!phoneNumber.startsWith("+20")) {
          phoneNumber = "+20" + phoneNumber;
        }
        await db.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            phoneNumber,
            phoneNumberVerified: true,
          },
        });
      },
    }),
  ],
});

export const getServerAuthSession = async () =>
  await auth.api.getSession({
    headers: headers(),
  });
