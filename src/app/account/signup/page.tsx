"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signupUser } from "@/lib/actions/signupUser";

export default function AccountSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signupUser({ email, password, confirmPassword, name });
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create your account</h1>
      <p className="text-sm text-slate-600 mb-6">
        Plan your wedding, save vendors, and track enquiries.{" "}
        <Link href="/account/login" className="text-shaadi-deep underline">
          Log in
        </Link>
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block text-sm text-slate-700 mb-1">Name (optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-700 mb-1">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-700 mb-1">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
          <span className="block text-xs text-slate-500 mt-1">Min 8 chars, must include a number.</span>
        </label>
        <label className="block">
          <span className="block text-sm text-slate-700 mb-1">Confirm password</span>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-shaadi-deep text-white py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="text-xs text-slate-500 mt-6 text-center">
        Are you a vendor?{" "}
        <Link href="/vendor/signup" className="underline">
          Vendor signup
        </Link>
      </p>
    </main>
  );
}
