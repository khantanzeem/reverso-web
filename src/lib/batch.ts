// Batch scheduling. Batch templates live in Firestore (`batchTemplates`, admin-managed
// from /admin/batches) so timing can be adjusted without a code change. Each enrollment
// is deterministically assigned one template based on course + user, so the same
// enrollment always shows the same batch/schedule.

export interface Batch {
  name: string;
  days: number[]; // 0=Sun..6=Sat
  time: string; // human-readable
  startHour: number; // 24h, for computing the next class
  startMinute: number;
  joinLink: string;
}

// Used only if `batchTemplates` is empty (e.g. a fresh project before seeding).
export const FALLBACK_BATCHES: Batch[] = [
  {
    name: "Weekday Evening Batch",
    days: [1, 3, 5],
    time: "7:00 PM – 8:30 PM IST",
    startHour: 19,
    startMinute: 0,
    joinLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    name: "Weekday Morning Batch",
    days: [2, 4],
    time: "9:00 AM – 10:30 AM IST",
    startHour: 9,
    startMinute: 0,
    joinLink: "https://meet.google.com/klm-nopq-rst",
  },
  {
    name: "Weekend Batch",
    days: [0, 6],
    time: "10:00 AM – 12:00 PM IST",
    startHour: 10,
    startMinute: 0,
    joinLink: "https://meet.google.com/uvw-xyz1-234",
  },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function batchDaysLabel(days: number[]): string {
  return days.map((d) => DAY_LABELS[d]).join(", ");
}

export function pickBatch(seed: string, batches: Batch[] = FALLBACK_BATCHES): Batch {
  if (batches.length === 0) return FALLBACK_BATCHES[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return batches[hash % batches.length];
}

export function parseTimeLabel(display: string): { startHour: number; startMinute: number } {
  const match = display.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return { startHour: 9, startMinute: 0 };
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return { startHour: hour, startMinute: minute };
}

export function nextClassDate(batch: Pick<Batch, "days" | "startHour" | "startMinute">, from = new Date()): Date {
  for (let i = 0; i < 8; i++) {
    const candidate = new Date(from);
    candidate.setDate(from.getDate() + i);
    candidate.setHours(batch.startHour, batch.startMinute, 0, 0);
    if (batch.days.includes(candidate.getDay()) && candidate.getTime() > from.getTime()) {
      return candidate;
    }
  }
  return from;
}
