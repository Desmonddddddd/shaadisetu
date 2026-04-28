import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import { rateLimit } from "@/lib/rateLimit";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

// Pre-computed bcrypt hash of a long random string. Used to keep the
// time-cost of "no such email" identical to "wrong password", which blocks
// timing-based user enumeration.
const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8Jx9oPeXwGgD1A9d2tSxPBTGm7LSFi";

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

        // 10 login attempts per email per 15 min — slows online brute-force
        // without locking out a forgetful real user.
        const limit = rateLimit(`login:${email}`, 10, 15 * 60 * 1000);
        if (!limit.allowed) return null;

        const [vendorAccount, userAccount] = await Promise.all([
          db.vendorAccount.findUnique({ where: { email } }),
          db.userAccount.findUnique({ where: { email } }),
        ]);

        if (vendorAccount) {
          const ok = await bcrypt.compare(password, vendorAccount.passwordHash);
          if (!ok) return null;
          return { id: vendorAccount.id, email: vendorAccount.email, kind: "vendor" };
        }

        if (userAccount) {
          const ok = await bcrypt.compare(password, userAccount.passwordHash);
          if (!ok) return null;
          return { id: userAccount.id, email: userAccount.email, kind: "user" };
        }

        // No account found — still spend bcrypt time so a timing attacker
        // cannot tell unknown-email apart from wrong-password.
        await bcrypt.compare(password, DUMMY_HASH);
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
