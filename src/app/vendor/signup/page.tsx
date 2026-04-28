"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signupVendor } from "@/lib/actions/signup";

export default function VendorSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signupVendor({ email, password, confirmPassword });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.status === "pending") {
        setPendingNotice(true);
      }
      // active path: signupVendor calls signIn with redirectTo, so the
      // redirect will happen server-side; no client navigation needed.
    });
  }

  if (pendingNotice) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Account created</h1>
        <p className="text-slate-600">
          Your email isn&apos;t linked to an existing vendor profile yet. We&apos;ll review your
          account and email you when it&apos;s active.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Vendor signup</h1>
      <p className="text-sm text-slate-600 mb-6">
        Already have an account?{" "}
        <Link href="/vendor/login" className="text-shaadi-deep underline">
          Log in
        </Link>
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
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
    </main>
  );
}
