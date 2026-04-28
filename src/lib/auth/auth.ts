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
        const account = await db.vendorAccount.findUnique({
          where: { email: parsed.data.email },
        });
        if (!account) return null;
        const ok = await bcrypt.compare(parsed.data.password, account.passwordHash);
        if (!ok) return null;
        return { id: account.id, email: account.email };
      },
    }),
  ],
});
