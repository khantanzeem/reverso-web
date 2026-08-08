// Simulated batch scheduling — until real batch management exists, every enrollment
// is deterministically assigned one of these fixed batches based on course + user,
// so the same enrollment always shows the same batch/schedule.

export interface Batch {
  name: string;
  days: number[]; // 0=Sun..6=Sat
  time: string; // human-readable
  startHour: number; // 24h, for computing the next class
  startMinute: number;
  joinLink: string;
}

export const BATCHES: Batch[] = [
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

export function pickBatch(seed: string): Batch {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return BATCHES[hash % BATCHES.length];
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
