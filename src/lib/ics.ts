// Builds a minimal iCalendar (.ics) event so a booking can be added to Google
// Calendar in one click. Times are "floating" (no timezone), so they show at
// the same wall-clock time wherever the calendar is opened.

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function stamp(date: string, time: string) {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

export function bookingToIcs({
  uid,
  date,
  time,
  durationMinutes = 60,
  summary,
  description,
}: {
  uid: string;
  date: string;
  time: string | null;
  durationMinutes?: number;
  summary: string;
  description: string;
}) {
  const start = time && /^\d{2}:\d{2}$/.test(time) ? time : "09:00";
  const [h = 9, m = 0] = start.split(":").map(Number);
  const endTotal = h * 60 + m + durationMinutes;
  const end = `${String(Math.floor(endTotal / 60) % 24).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Signature by Lilian//Bookings//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@signaturebylilian.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART:${stamp(date, start)}`,
    `DTEND:${stamp(date, end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    "LOCATION:Signature by Lilian Oasis\\, Wuye\\, Abuja",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
