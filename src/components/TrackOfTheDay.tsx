"use client";

import { useEffect, useRef, useState } from "react";
import { useBackdropTone } from "@/hooks/useBackdropTone";

// Royalty-free instrumental ambient — swap freely. Cached by the browser
// after first play. Each track has a sourced cover credit.
const TRACKS = [
  {
    id: "shehnai-morning",
    title: "Shehnai at Daybreak",
    artist: "Ust. Bismillah Khan",
    src: "/audio/shehnai.mp3",
  },
  {
    id: "tabla-sangeet",
    title: "Tabla for the Sangeet",
    artist: "Zaheer-Abbas Janmohamed",
    src: "/audio/tabla.mp3",
  },
  {
    id: "sitar-evening",
    title: "Sitar at Sundown",
    artist: "Saumitra Lahari",
    src: "/audio/sitar.mp3",
  },
  {
    id: "wedding-bells",
    title: "Mandap Reverie",
    artist: "Ust. Amjad Ali Khan",
    src: "/audio/mandap.mp3",
  },
];

const STORAGE_KEY = "shaadisetu.musicEnabled";

function pickDailyTrack() {
  const day = Math.floor(Date.now() / 86_400_000);
  return TRACKS[day % TRACKS.length];
}

// Lazy initialiser — read persisted state once at first client render so we
// don't trigger a cascading re-render from inside an effect.
function loadEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function TrackOfTheDay() {
  const [enabled, setEnabled] = useState<boolean>(loadEnabled);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pillRef = useRef<HTMLButtonElement | null>(null);
  const track = pickDailyTrack();
  // Sample the page behind the pill. When the expanded card is open, the
  // panel has its own background so we can stop sampling and freeze the tone.
  const backdrop = useBackdropTone(pillRef, !(enabled && expanded));

  // Persist enabled state and pause the audio when disabled. onPause on the
  // <audio> element flips `playing` back to false — no setState here.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch {}
    if (!enabled) audioRef.current?.pause();
  }, [enabled]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <div
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
      className="fixed left-5 z-40 select-none"
    >
      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Expanded card */}
      {enabled && expanded && (
        <div className="mb-3 w-72 bg-cream border border-ink/15 shadow-[0_20px_50px_-20px_rgba(43,33,25,0.45)] overflow-hidden animate-[fadeUp_360ms_ease-out]">
          <div className="bg-ink text-cream px-4 py-3 flex items-center justify-between">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-champagne">
              Track of the Day
            </p>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Collapse player"
              className="text-cream/60 hover:text-champagne transition-colors text-xs"
            >
              ✕
            </button>
          </div>
          <div className="p-5">
            <p className="font-serif-display text-xl text-ink leading-tight">
              {track.title}
            </p>
            <span className="block w-8 h-px bg-champagne my-3" />
            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
              {track.artist}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2.5 bg-bordeaux text-cream text-[0.7rem] uppercase tracking-[0.22em] hover:bg-ink transition-colors"
              >
                {playing ? (
                  <>
                    <PauseIcon />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon />
                    Play
                  </>
                )}
              </button>
              <button
                onClick={() => setEnabled(false)}
                className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux editorial-link"
              >
                Mute site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle pill — adaptive contrast against the page behind it */}
      <button
        ref={pillRef}
        onClick={() => {
          if (!enabled) {
            setEnabled(true);
            setExpanded(true);
          } else {
            setExpanded((v) => !v);
          }
        }}
        aria-label={enabled ? "Music player" : "Enable music"}
        className={`group flex items-center gap-2 pl-2 pr-3 py-2 border transition-colors duration-300 ${
          enabled
            ? backdrop === "dark"
              ? "bg-cream border-cream text-ink hover:bg-champagne"
              : "bg-ink border-ink text-cream hover:bg-bordeaux"
            : backdrop === "dark"
              ? "bg-cream/95 border-cream/40 text-ink hover:bg-cream"
              : "bg-cream border-ink/20 text-ink hover:border-ink"
        }`}
      >
        <span
          className={`w-7 h-7 flex items-center justify-center transition-colors duration-300 ${
            enabled
              ? backdrop === "dark"
                ? "bg-bordeaux text-cream"
                : "bg-champagne text-ink"
              : backdrop === "dark"
                ? "bg-bordeaux text-cream"
                : "bg-ink text-cream"
          }`}
        >
          {enabled && playing ? <SoundOnAnimated /> : <MusicNoteIcon />}
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.22em] font-medium">
          {enabled ? (playing ? "Playing" : "Music") : "Music"}
        </span>
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function MusicNoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Two-bar music note — the universal "music" glyph */}
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
      <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SoundOnAnimated() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
      <rect x="2" y="6" width="2" height="4">
        <animate attributeName="height" values="4;10;4" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="y" values="6;3;6" dur="0.9s" repeatCount="indefinite" />
      </rect>
      <rect x="7" y="3" width="2" height="10">
        <animate attributeName="height" values="10;4;10" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="y" values="3;6;3" dur="0.9s" repeatCount="indefinite" />
      </rect>
      <rect x="12" y="6" width="2" height="4">
        <animate attributeName="height" values="4;9;4" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="y" values="6;3.5;6" dur="1.1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
