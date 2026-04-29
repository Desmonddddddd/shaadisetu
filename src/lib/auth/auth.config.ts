import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no bcrypt. Used by middleware.
// The full config in auth.ts extends this with the Credentials provider.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/account/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      // /vendor/dashboard does its own redirect to /vendor/login in its layout;
      // skipping it here keeps users and vendors on the right login page.
      if (pathname === "/account/login" || pathname === "/account/signup") return true;
      if (pathname.startsWith("/account")) return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;
