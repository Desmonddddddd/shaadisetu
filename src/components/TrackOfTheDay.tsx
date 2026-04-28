"use client";

import { useEffect, useRef, useState } from "react";

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

export default function TrackOfTheDay() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = pickDailyTrack();

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setEnabled(true);
    } catch {}
    setMounted(true);
  }, []);

  // Persist enabled state
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch {}
    if (!enabled && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [enabled, mounted]);

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

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
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

      {/* Toggle pill */}
      <button
        onClick={() => {
          if (!enabled) {
            setEnabled(true);
            setExpanded(true);
          } else {
            setExpanded((v) => !v);
          }
        }}
        aria-label={enabled ? "Music player" : "Enable music"}
        className={`group flex items-center gap-2 pl-2 pr-3 py-2 border transition-all ${
          enabled
            ? "bg-ink border-ink text-cream hover:bg-bordeaux"
            : "bg-cream border-ink/20 text-ink hover:border-ink"
        }`}
      >
        <span
          className={`w-7 h-7 flex items-center justify-center ${
            enabled ? "bg-champagne text-ink" : "bg-ink text-cream"
          }`}
        >
          {enabled && playing ? <SoundOnAnimated /> : enabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.22em] font-medium">
          {enabled ? (playing ? "Playing" : "Music") : "Sound"}
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
function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19 12a7 7 0 0 0-3-5.7M16 8a3 3 0 0 1 0 8" />
    </svg>
  );
}
function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M22 9l-6 6M16 9l6 6" />
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
