"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth/auth";

const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Min 8 characters").regex(/\d/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type SignupResult =
  | { ok: true; status: "active" | "pending" }
  | { ok: false; error: string };

export async function signupVendor(input: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const existing = await db.vendorAccount.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return { ok: false, error: "Account already exists. Please log in." };

  const matchingVendor = await db.vendor.findUnique({
    where: { email: parsed.data.email },
  });
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.vendorAccount.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      vendorId: matchingVendor?.id ?? null,
      status: matchingVendor ? "active" : "pending",
    },
  });

  if (matchingVendor) {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/vendor/dashboard",
    });
    return { ok: true, status: "active" };
  }
  return { ok: true, status: "pending" };
}
