import type { Review } from "@/data/reviews";

export function VendorReviews({ reviews }: { reviews: Review[] }) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...histogram.map((h) => h.count), 1);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Reviews ({reviews.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 bg-white border border-gray-200 rounded-xl p-4">
        <div>
          <div className="text-3xl font-bold text-slate-900">{avg.toFixed(1)}</div>
          <div className="text-amber-400">{"★".repeat(Math.round(avg))}</div>
          <div className="text-xs text-slate-500 mt-1">{reviews.length} reviews</div>
          <div className="mt-3 space-y-1">
            {histogram.map((h) => (
              <div key={h.star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{h.star}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${(h.count / max) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-slate-500">{h.count}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-gray-100 last:border-0 pb-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-medium text-slate-900">{r.title}</h3>
                <span className="text-xs text-slate-500">{r.date}</span>
              </div>
              <div className="text-amber-400 text-sm">{"★".repeat(r.rating)}</div>
              <p className="text-sm text-slate-700 mt-1">{r.body}</p>
              <p className="text-xs text-slate-500 mt-1">{r.author} · {r.eventType}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
