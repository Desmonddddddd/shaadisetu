"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function VendorLoginPage() {
  return (
    <Suspense fallback={<main className="max-w-md mx-auto px-4 py-12">Loading...</main>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") ?? "/vendor/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Vendor login</h1>
      <p className="text-sm text-slate-600 mb-6">
        New here?{" "}
        <Link href="/vendor/signup" className="text-shaadi-deep underline">
          Create an account
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
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-shaadi-deep text-white py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
