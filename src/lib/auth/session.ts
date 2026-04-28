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

export async function requireVendorSession(): Promise<{
  accountId: string;
  vendorId: string;
}> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) throw new UnauthorizedError();
  const account = await db.vendorAccount.findUnique({ where: { id: userId } });
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
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const account = await db.vendorAccount.findUnique({ where: { id: userId } });
  if (!account) return null;
  return { accountId: account.id, vendorId: account.vendorId, status: account.status };
}
