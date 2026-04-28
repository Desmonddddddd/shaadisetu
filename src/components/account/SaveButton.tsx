"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleSaveVendor } from "@/lib/actions/saved";

type Props = {
  vendorId: string;
  initialSaved: boolean;
  isAuthed: boolean;
  variant?: "icon" | "pill";
  className?: string;
};

export function SaveButton({
  vendorId,
  initialSaved,
  isAuthed,
  variant = "pill",
  className = "",
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      router.push(`/account/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        const res = await toggleSaveVendor(vendorId);
        setSaved(res.saved);
      } catch {
        setSaved(!next);
      }
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-label={saved ? "Unsave vendor" : "Save vendor"}
        className={`p-1.5 rounded-full hover:bg-shaadi-light transition-colors ${className}`}
      >
        <Heart filled={saved} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
        saved
          ? "border-shaadi-deep text-shaadi-deep bg-shaadi-light"
          : "border-gray-200 text-slate-700 hover:border-shaadi-deep hover:text-shaadi-deep"
      } disabled:opacity-50 ${className}`}
    >
      <Heart filled={saved} small />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

function Heart({ filled, small }: { filled: boolean; small?: boolean }) {
  const cls = small ? "w-4 h-4" : "w-5 h-5";
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.5c0 6-9 11.5-9 11.5S3 14.5 3 8.5a4.5 4.5 0 0 1 8.25-2.5A4.5 4.5 0 0 1 21 8.5z"
      />
    </svg>
  );
}
