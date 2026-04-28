import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/lib/db";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("FORBIDDEN");
  }
}

type SessionUser = { id?: string; kind?: "vendor" | "user" };

export async function requireVendorSession(): Promise<{
  accountId: string;
  vendorId: string;
}> {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u?.id || u.kind !== "vendor") throw new UnauthorizedError();
  const account = await db.vendorAccount.findUnique({ where: { id: u.id } });
  if (!account) throw new UnauthorizedError();
  if (account.status !== "active" || !account.vendorId) throw new ForbiddenError();
  return { accountId: account.id, vendorId: account.vendorId };
}

export async function getOptionalVendorSession(): Promise<{
  accountId: string;
  vendorId: string | null;
  status: string;
} | null> {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u?.id || u.kind !== "vendor") return null;
  const account = await db.vendorAccount.findUnique({ where: { id: u.id } });
  if (!account) return null;
  return { accountId: account.id, vendorId: account.vendorId, status: account.status };
}

export async function requireUserSession(): Promise<{ userId: string; email: string }> {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u?.id || u.kind !== "user") throw new UnauthorizedError();
  const account = await db.userAccount.findUnique({ where: { id: u.id } });
  if (!account) throw new UnauthorizedError();
  return { userId: account.id, email: account.email };
}

export async function getOptionalUserSession(): Promise<{
  userId: string;
  email: string;
  name: string | null;
} | null> {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u?.id || u.kind !== "user") return null;
  const account = await db.userAccount.findUnique({ where: { id: u.id } });
  if (!account) return null;
  return { userId: account.id, email: account.email, name: account.name };
}

/**
 * For protected user pages: bounce unauthenticated visitors to the login
 * screen instead of throwing. Defense-in-depth in case middleware fails open.
 */
export async function getUserSessionOrRedirect(): Promise<{
  userId: string;
  email: string;
}> {
  const session = await auth();
  const u = session?.user as SessionUser | undefined;
  if (!u?.id || u.kind !== "user") redirect("/account/login");
  const account = await db.userAccount.findUnique({ where: { id: u.id } });
  if (!account) redirect("/account/login");
  return { userId: account.id, email: account.email };
}
