import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { db } from "@/server/db";
import { env } from "@/env";
import { AdTiers } from "@prisma/client";
import { loginSchema } from "@/schema/auth";
import { getUserByEmail } from "@/database/users";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
// OAuth
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      image: string;
      bio: string;
      phoneNumber: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    bio: string;
    phoneNumber: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        bio: token.bio as string | undefined,
        phoneNumber: token.phoneNumber as string | undefined,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.bio = user.bio;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      //@ts-ignore
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;
        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
    /**
     * ...add providers here.
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  events: {
    async createUser(message) {
      const getRefreshTime = (days: number) => {
        const date = new Date(Date.now());
        date.setDate(date.getDate() + days);
        return date;
      };
      await db.user.update({
        where: { id: message.user.id },
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
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
