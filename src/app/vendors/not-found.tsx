import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">We couldn&apos;t find that page</h1>
      <p className="text-slate-600 mt-2">The city, category, or vendor you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/vendors"
        className="inline-block mt-6 bg-shaadi-deep text-white px-5 py-2 rounded-lg"
      >
        Browse all categories
      </Link>
    </main>
  );
}
