import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const vendorAccount = await db.vendorAccount.findUnique({ where: { email } });
        if (vendorAccount) {
          const ok = await bcrypt.compare(password, vendorAccount.passwordHash);
          if (!ok) return null;
          return { id: vendorAccount.id, email: vendorAccount.email, kind: "vendor" };
        }

        const userAccount = await db.userAccount.findUnique({ where: { email } });
        if (userAccount) {
          const ok = await bcrypt.compare(password, userAccount.passwordHash);
          if (!ok) return null;
          return { id: userAccount.id, email: userAccount.email, kind: "user" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.kind = (user as { kind: string }).kind;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; kind?: string }).id = token.id as string;
        (session.user as { id?: string; kind?: string }).kind = token.kind as string;
      }
      return session;
    },
  },
});
