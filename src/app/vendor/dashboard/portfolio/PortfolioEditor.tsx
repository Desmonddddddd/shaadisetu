"use client";

import { useRef, useState, useTransition } from "react";
import {
  addPortfolioImage,
  deletePortfolioImage,
  setCoverImage,
} from "@/lib/actions/portfolio";

type Item = { id: string; url: string; caption: string; eventType: string };

interface Props {
  initialItems: Item[];
  initialCover: string | null;
}

export function PortfolioEditor({ initialItems, initialCover }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [cover, setCover] = useState<string | null>(initialCover);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Max 8MB per image");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await addPortfolioImage({ dataUrl, filename: file.name });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setItems((prev) => [{ id: res.id, url: res.url, caption: "", eventType: "" }, ...prev]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onDelete(id: string) {
    startTransition(async () => {
      await deletePortfolioImage(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      const removed = items.find((it) => it.id === id);
      if (removed && cover === removed.url) setCover(null);
    });
  }

  function onSetCover(url: string | null) {
    startTransition(async () => {
      await setCoverImage(url);
      setCover(url);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-slate-700 mb-2">Cover image</h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-shaadi-light to-shaadi-rose">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-white/80">
                No cover
              </div>
            )}
          </div>
          {cover && (
            <button
              type="button"
              onClick={() => onSetCover(null)}
              disabled={isPending}
              className="text-sm text-slate-600 underline"
            >
              Clear cover
            </button>
          )}
          <p className="text-xs text-slate-500">
            Pick a portfolio image below and click &ldquo;Use as cover&rdquo;.
          </p>
        </div>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          className="hidden"
          id="portfolio-upload"
        />
        <label
          htmlFor="portfolio-upload"
          className={`inline-block px-4 py-2 rounded-lg font-medium text-sm cursor-pointer ${
            isUploading
              ? "bg-gray-200 text-gray-500"
              : "bg-shaadi-deep text-white hover:opacity-90"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload image"}
        </label>
        <p className="text-xs text-slate-500 mt-2">JPG / PNG / WebP, up to 8MB</p>
        {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No portfolio images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((it) => {
            const isCover = cover === it.url;
            return (
              <div
                key={it.id}
                className={`group relative rounded-lg overflow-hidden border ${
                  isCover ? "border-shaadi-deep ring-2 ring-shaadi-deep/40" : "border-gray-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt={it.caption || "Portfolio"} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSetCover(isCover ? null : it.url)}
                    disabled={isPending}
                    className="text-xs px-2 py-1 rounded bg-white/90 text-slate-800 hover:bg-white"
                  >
                    {isCover ? "✓ Cover" : "Use as cover"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(it.id)}
                    disabled={isPending}
                    className="text-xs px-2 py-1 rounded bg-red-600/90 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });
}
