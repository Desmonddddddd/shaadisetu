export type Priority = "low" | "medium" | "high";

export interface DefaultTask {
  id: string;
  title: string;
  bucket: string;
  priority: Priority;
  notesHint?: string;
}

export const TIMELINE_BUCKETS = [
  { id: "12m", label: "12+ months out" },
  { id: "9m", label: "9–12 months out" },
  { id: "6m", label: "6–9 months out" },
  { id: "3m", label: "3–6 months out" },
  { id: "1m", label: "1–3 months out" },
  { id: "2w", label: "2 weeks out" },
  { id: "week", label: "Wedding week" },
  { id: "after", label: "After the wedding" },
] as const;

export type BucketId = (typeof TIMELINE_BUCKETS)[number]["id"];

export const DEFAULT_TASKS: DefaultTask[] = [
  // 12+ months
  { id: "set-budget", title: "Set the overall wedding budget", bucket: "12m", priority: "high" },
  { id: "guest-list-draft", title: "Draft a rough guest list", bucket: "12m", priority: "high" },
  { id: "pick-dates", title: "Pick 2–3 candidate dates", bucket: "12m", priority: "high" },
  { id: "shortlist-cities", title: "Shortlist host cities or destinations", bucket: "12m", priority: "medium" },
  { id: "muhurat", title: "Consult priest / family elders for muhurats", bucket: "12m", priority: "medium" },

  // 9–12 months
  { id: "book-venue", title: "Book the main venue", bucket: "9m", priority: "high" },
  { id: "book-photographer", title: "Lock in the photographer", bucket: "9m", priority: "high" },
  { id: "book-planner", title: "Hire a wedding planner (if using)", bucket: "9m", priority: "medium" },
  { id: "save-the-date", title: "Send save-the-dates", bucket: "9m", priority: "medium" },
  { id: "passport-check", title: "Verify passports / visas for destination weddings", bucket: "9m", priority: "medium" },

  // 6–9 months
  { id: "book-caterer", title: "Finalize the caterer & menu tasting", bucket: "6m", priority: "high" },
  { id: "book-decor", title: "Finalize decor team & moodboard", bucket: "6m", priority: "high" },
  { id: "bridal-attire", title: "Order bridal lehenga / attire", bucket: "6m", priority: "high" },
  { id: "groom-attire", title: "Order groom's sherwani / attire", bucket: "6m", priority: "medium" },
  { id: "invite-design", title: "Commission invitation design", bucket: "6m", priority: "medium" },
  { id: "book-music", title: "Book DJ / live band / dhol", bucket: "6m", priority: "medium" },

  // 3–6 months
  { id: "send-invites", title: "Print and send wedding invitations", bucket: "3m", priority: "high" },
  { id: "rooms-blocks", title: "Block hotel rooms for outstation guests", bucket: "3m", priority: "high" },
  { id: "mehendi-artist", title: "Book mehendi artist", bucket: "3m", priority: "medium" },
  { id: "makeup-artist", title: "Book bridal makeup artist + trial", bucket: "3m", priority: "high" },
  { id: "jewellery", title: "Finalize bridal jewellery", bucket: "3m", priority: "medium" },
  { id: "honeymoon", title: "Book honeymoon flights & stay", bucket: "3m", priority: "low" },
  { id: "rituals-list", title: "Build a ritual-by-ritual schedule with priest", bucket: "3m", priority: "medium" },

  // 1–3 months
  { id: "rsvp-followup", title: "Follow up on RSVPs", bucket: "1m", priority: "high" },
  { id: "seating", title: "Plan the seating chart", bucket: "1m", priority: "medium" },
  { id: "transport", title: "Confirm guest transport / shuttles", bucket: "1m", priority: "medium" },
  { id: "vendor-payments", title: "Schedule vendor advance payments", bucket: "1m", priority: "high" },
  { id: "ritual-supplies", title: "Order pooja / ritual supplies", bucket: "1m", priority: "medium" },
  { id: "wedding-website", title: "Update the wedding website with final info", bucket: "1m", priority: "low" },

  // 2 weeks
  { id: "final-fittings", title: "Final attire fittings (bride & groom)", bucket: "2w", priority: "high" },
  { id: "final-headcount", title: "Confirm final headcount with caterer", bucket: "2w", priority: "high" },
  { id: "vendor-timeline", title: "Share day-of timeline with all vendors", bucket: "2w", priority: "high" },
  { id: "emergency-kit", title: "Pack a bridal emergency kit", bucket: "2w", priority: "medium" },
  { id: "tip-envelopes", title: "Prepare tip envelopes for staff", bucket: "2w", priority: "medium" },

  // Wedding week
  { id: "rehearsal", title: "Run mandap / pheras rehearsal", bucket: "week", priority: "high" },
  { id: "haldi-prep", title: "Haldi & sangeet final prep", bucket: "week", priority: "high" },
  { id: "vendor-checkin", title: "Confirm vendor arrival times", bucket: "week", priority: "high" },
  { id: "self-care", title: "Salon, hair colour, skin prep", bucket: "week", priority: "medium" },
  { id: "guest-welcome", title: "Set up guest welcome bags", bucket: "week", priority: "low" },

  // After
  { id: "thank-you-cards", title: "Send thank-you notes", bucket: "after", priority: "medium" },
  { id: "vendor-reviews", title: "Leave reviews for the vendors who showed up for you", bucket: "after", priority: "medium" },
  { id: "name-change", title: "Begin name-change paperwork (if applicable)", bucket: "after", priority: "low" },
  { id: "preserve-attire", title: "Preserve & dry-clean wedding attire", bucket: "after", priority: "low" },
  { id: "photo-album", title: "Order a printed wedding album", bucket: "after", priority: "low" },
];
