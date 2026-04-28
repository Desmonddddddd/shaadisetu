export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="block w-16 h-px bg-champagne" />
      <Paisley />
      <span className="block w-16 h-px bg-champagne" />
    </div>
  );
}

function Paisley() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
      className="text-champagne"
      fill="currentColor"
    >
      <path d="M12 2c2 3 1 5 0 7-1 2-3 3-3 6 0 2.5 2 4 4 4 1.5 0 3-1 3-2.5 0-1.2-1-2-2-2-.7 0-1.2.4-1.2 1 0 .4.3.7.7.7-.1.5-.7.8-1.3.8-.9 0-1.7-.6-1.7-1.6 0-1.4 1.3-2.4 3-2.4 2.3 0 4 1.6 4 3.8C17.2 19.4 14.8 22 12 22c-3.3 0-6-2.6-6-6 0-3 2-5 3.5-7 1.5-2 2.5-4 2.5-7z" />
    </svg>
  );
}
