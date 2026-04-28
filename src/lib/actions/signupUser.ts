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
    name: z.string().trim().max(80).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type SignupUserResult = { ok: true } | { ok: false; error: string };

export async function signupUser(input: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}): Promise<SignupUserResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.userAccount.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { ok: false, error: "Account already exists. Please log in." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.userAccount.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name?.length ? parsed.data.name : null,
    },
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/account/saved",
  });
  return { ok: true };
}
