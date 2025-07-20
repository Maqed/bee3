import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { env } from "@/env";
import { headers } from "next/headers";
import { AdTiers } from "@prisma/client";
import { phoneNumber, admin } from "better-auth/plugins";
import { toPathFormat } from "./category";
import { createId } from "@paralleldrive/cuid2";
import { NextRequest } from "next/server";
import { sendVerificationEmail, sendResetPasswordEmail } from "./mail";

export const auth = betterAuth({
  appName: "Bee3",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const locale =
        (request as NextRequest).cookies.get("NEXT_LOCALE")?.value ?? "ar";
      await sendResetPasswordEmail({
        email: user.email,
        name: user.name,
        resetUrl: url,
        locale,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const locale =
        (request as NextRequest).cookies.get("NEXT_LOCALE")?.value ?? "ar";
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationUrl: url,
        locale,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
      contactMethod: {
        type: "string",
      },
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {
        if (!phoneNumber.startsWith("+20")) {
          phoneNumber = "+20" + phoneNumber;
        }
        const session = await getServerAuthSession();
        if (!session) {
          throw new APIError("UNAUTHORIZED");
        }
        const isPhoneNumberExist = await db.user.findUnique({
          where: {
            phoneNumber,
          },
        });
        if (!!isPhoneNumberExist) {
          throw new APIError("BAD_REQUEST", {
            message: "Phone number already exists",
            code: "PHONE_NUMBER_EXISTS",
          });
        }

        const locale =
          (request as NextRequest).cookies.get("NEXT_LOCALE")?.value ?? "ar";
        const sendMessageURL = `https://graph.facebook.com/v22.0/${env.WA_PHONE_NUMBER_ID}/messages`;
        const payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "template",
          template: {
            name: `otp_bee3_${locale}`,
            language: {
              code: locale,
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: code,
                  },
                ],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  {
                    type: "text",
                    text: code,
                  },
                ],
              },
            ],
          },
        };

        const response = await fetch(sendMessageURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.WA_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      },
    }),
    admin(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // Cache for 1 minute
    },
  },
  advanced: {
    cookiePrefix: "bee3",
  },
});

export const getServerAuthSession = async () =>
  await auth.api.getSession({
    headers: headers(),
  });
