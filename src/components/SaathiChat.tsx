"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBackdropTone } from "@/hooks/useBackdropTone";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Namaste — I'm **SAATHI**, your wedding planning companion. Tell me where you are in the journey: a date, a city, a function you're stuck on. I'll take it from there.",
};

const STORAGE_KEY = "shaadisetu.saathi.history";

// Tiny markdown renderer — bold, italics, and [label](url) links only.
// Anything else falls through as plain text. We deliberately keep this small
// so we don't ship a full markdown library for a chat bubble.
function renderInline(text: string) {
  const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out: (string | { label: string; href: string })[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push({ label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));

  // Now apply bold/italic to the string segments.
  return out.map((part, i) => {
    if (typeof part !== "string") {
      const isExternal = /^https?:/.test(part.href);
      return (
        <a
          key={i}
          href={part.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-bordeaux underline underline-offset-2 hover:text-ink transition-colors"
        >
          {part.label}
        </a>
      );
    }
    const segments = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <span key={i}>
        {segments.map((s, j) => {
          if (s.startsWith("**") && s.endsWith("**"))
            return (
              <strong key={j} className="font-semibold">
                {s.slice(2, -2)}
              </strong>
            );
          if (s.startsWith("*") && s.endsWith("*"))
            return (
              <em key={j} className="italic">
                {s.slice(1, -1)}
              </em>
            );
          return <span key={j}>{s}</span>;
        })}
      </span>
    );
  });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const lines = message.content.split(/\n\n+/);
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] bg-ink text-cream px-4 py-2.5 text-sm leading-relaxed"
            : "max-w-[90%] bg-cream-soft text-ink px-4 py-3 text-sm leading-relaxed border-l-2 border-champagne"
        }
      >
        {lines.map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2.5" : ""}>
            {renderInline(line)}
          </p>
        ))}
      </div>
    </div>
  );
}

// Lazy initialiser — runs once on first client render. Pulls any prior
// transcript out of localStorage so reopening the panel feels continuous.
function loadInitialMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // ignore corrupted storage
  }
  return [WELCOME_MESSAGE];
}

export default function SaathiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadInitialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  // Sample the page behind the launcher whenever it isn't covered by the
  // open chat panel.
  const backdrop = useBackdropTone(launcherRef, !open);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full / disabled — fail quietly
    }
  }, [messages]);

  // Auto-scroll on new content.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, open]);

  // Esc closes; cancels any in-flight stream cleanly.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setStreamingText("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Send only the last 20 turns so we don't grow context unbounded.
      const trimmed = next.slice(-20);
      const res = await fetch("/api/saathi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const data = JSON.parse(payload) as
              | { type: "text"; text: string }
              | { type: "done" }
              | { type: "error"; message: string };
            if (data.type === "text") {
              assembled += data.text;
              setStreamingText(assembled);
            } else if (data.type === "error") {
              throw new Error(data.message);
            }
          } catch {
            // ignore malformed event
          }
        }
      }

      setMessages((m) => [...m, { role: "assistant", content: assembled }]);
      setStreamingText("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setStreamingText("");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, streaming]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void send();
      }
    },
    [send],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setStreamingText("");
    setError(null);
    setStreaming(false);
  }, []);

  const visibleMessages = useMemo(
    () =>
      streamingText
        ? [...messages, { role: "assistant" as const, content: streamingText }]
        : messages,
    [messages, streamingText],
  );

  return (
    <>
      {/* Floating launcher — flips between dark- and light-backdrop variants
          based on the page colour right behind it. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close SAATHI" : "Open SAATHI"}
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
        className={`fixed right-5 z-[55] flex items-center gap-2 px-4 py-3 transition-colors duration-300 group ${
          backdrop === "dark"
            ? "bg-cream text-ink hover:bg-champagne shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
            : "bg-ink text-cream hover:bg-bordeaux shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <span
          className={`block w-2 h-2 rounded-full animate-pulse ${
            backdrop === "dark" ? "bg-bordeaux" : "bg-champagne"
          }`}
        />
        <span className="text-[0.7rem] uppercase tracking-[0.22em] font-medium">
          {open ? "Close" : "Ask SAATHI"}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 4.25rem))" }}
          className="fixed right-5 z-[56] w-[calc(100vw-2.5rem)] sm:w-[420px] max-h-[min(640px,calc(100vh-9rem))] bg-cream border border-ink/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col animate-[fade-up_240ms_ease-out]"
        >
          {/* Header */}
          <div className="bg-ink text-cream px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-champagne">
                ShaadiSetu
              </p>
              <p className="font-serif-display text-lg leading-tight">
                SAATHI <span className="italic text-champagne">your companion</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="text-cream/60 hover:text-champagne text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 transition-colors"
                aria-label="Start a new chat"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-cream/60 hover:text-champagne text-lg leading-none px-2 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 bg-cream"
          >
            {visibleMessages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {streaming && !streamingText && (
              <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft px-1 mt-1">
                <span className="block w-1.5 h-1.5 bg-bordeaux animate-pulse" />
                SAATHI is thinking…
              </div>
            )}
            {error && (
              <div className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1 mt-2">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-ink/10 p-3 flex-shrink-0 bg-cream">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about budgets, vendors, dates, anything…"
                rows={1}
                disabled={streaming}
                className="flex-1 resize-none bg-cream-soft border border-ink/10 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-bordeaux transition-colors disabled:opacity-60 max-h-32"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={streaming || !input.trim()}
                className="px-4 py-2.5 bg-bordeaux text-cream text-[0.65rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[0.55rem] uppercase tracking-[0.2em] text-ink-soft/70">
              SAATHI can be wrong — verify finance & vendor details directly.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
