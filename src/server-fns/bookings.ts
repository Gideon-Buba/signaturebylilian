import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
import { bookingToIcs } from "@/lib/ics";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const BOOKING_NOTIFICATION_EMAIL = "bookings@signaturebylilian.com";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  treatmentId: string | null;
  treatmentName: string;
  preferredDate: string | null;
  preferredTime: string | null;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

type BookingRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  treatment_id: string | null;
  treatment_name: string;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string;
  status: string;
  created_at: string;
};

function fromRow(row: BookingRow): Booking {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    treatmentId: row.treatment_id,
    treatmentName: row.treatment_name,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    notes: row.notes,
    status: row.status as BookingStatus,
    createdAt: row.created_at,
  };
}

const createBookingInput = z.object({
  customerName: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email().optional().or(z.literal("")),
  treatmentId: z.string().uuid().optional(),
  treatmentName: z.string().trim().min(1),
  preferredDate: z.string().trim().optional().or(z.literal("")),
  preferredTime: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().default(""),
});

type BookingInput = z.infer<typeof createBookingInput>;

// Customer-supplied text goes into these emails, so it's escaped first.
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function prettyDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function prettyTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

function detailRows(data: BookingInput) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#777;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:4px 0;"><strong>${esc(value)}</strong></td></tr>`;

  return [
    row("Treatment", data.treatmentName),
    data.preferredDate ? row("Preferred date", prettyDate(data.preferredDate)) : "",
    data.preferredTime ? row("Preferred time", prettyTime(data.preferredTime)) : "",
    data.notes ? row("Notes", data.notes) : "",
  ].join("");
}

function bookingNotificationHtml(data: BookingInput) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#777;white-space:nowrap;">${label}</td><td style="padding:4px 0;"><strong>${esc(value)}</strong></td></tr>`;

  return `
    <div style="font-family:sans-serif;font-size:15px;color:#222;">
      <p>A new appointment request came in on the website.</p>
      <table cellpadding="0" cellspacing="0">
        ${row("Name", data.customerName)}
        ${row("Phone", data.phone)}
        ${data.email ? row("Email", data.email) : ""}
        ${detailRows(data)}
      </table>
      <p style="margin-top:16px;">
        <a href="https://signaturebylilian.com/admin/bookings">View in the admin calendar</a>
      </p>
      ${data.preferredDate ? '<p style="color:#777;font-size:13px;">The attached invite adds this request to your calendar.</p>' : ""}
    </div>
  `;
}

function bookingAcknowledgementHtml(data: BookingInput) {
  return `
    <div style="font-family:Georgia,serif;font-size:16px;color:#222;max-width:560px;">
      <p style="letter-spacing:0.2em;text-transform:uppercase;font-size:12px;color:#a0247a;">Signature by Lilian Oasis</p>
      <h2 style="font-weight:normal;font-size:26px;margin:8px 0 16px;">We've received your request</h2>
      <p>Hi ${esc(data.customerName)},</p>
      <p>Thank you for booking with us. Your appointment request is in, and we'll confirm it personally within a few hours.</p>
      <table cellpadding="0" cellspacing="0" style="font-family:sans-serif;font-size:15px;margin:16px 0;">
        ${detailRows(data)}
      </table>
      <p>This isn't a confirmed booking yet. We'll call or WhatsApp you on the number you gave us to confirm the time. If you need to change anything before then, just reply to this email or <a href="https://wa.me/2349046004543">message us on WhatsApp</a>.</p>
      ${data.preferredDate ? '<p style="color:#777;font-size:13px;">We\'ve attached a calendar invite for the time you requested — open it to add this to your own calendar.</p>' : ""}
      <p style="margin-top:24px;">Warmly,<br />Signature by Lilian Oasis</p>
      <p style="color:#777;font-size:13px;margin-top:24px;">Mon to Sat, 9:00 am to 6:00 pm · No 2 Omako Street, Off No 3 Stephen Ocheni Street, Wuye, Abuja</p>
    </div>
  `;
}

export const createBookingFn = createServerFn({ method: "POST" })
  .validator(createBookingInput)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    // Guests can INSERT but not SELECT, so the id is generated here (the
    // calendar invite needs a stable one too).
    const bookingId = crypto.randomUUID();

    const { error } = await supabase.from("bookings").insert({
      id: bookingId,
      customer_name: data.customerName,
      phone: data.phone,
      email: data.email ? data.email : null,
      treatment_id: data.treatmentId ?? null,
      treatment_name: data.treatmentName,
      preferred_date: data.preferredDate ? data.preferredDate : null,
      preferred_time: data.preferredTime ? data.preferredTime : null,
      notes: data.notes,
    });

    if (error) throw new Error(error.message);

    // Built once and attached to both emails, so the customer can add the
    // appointment to their own calendar too, not just the admin inbox.
    const icsAttachment = data.preferredDate
      ? [
          {
            filename: "booking.ics",
            contentType: "text/calendar; charset=utf-8; method=PUBLISH",
            content: bookingToIcs({
              uid: bookingId,
              date: data.preferredDate,
              time: data.preferredTime || null,
              summary: `${data.treatmentName}: ${data.customerName} (requested)`,
              description: `Phone: ${data.phone}${data.email ? `\nEmail: ${data.email}` : ""}${data.notes ? `\nNotes: ${data.notes}` : ""}`,
            }),
          },
        ]
      : undefined;

    // Emails are notifications only: a failure of either must never fail the
    // booking itself, and one failing must not stop the other.
    const send = async (label: string, job: () => Promise<void>) => {
      try {
        await job();
      } catch (emailError) {
        console.error(`Failed to send ${label} email:`, emailError);
      }
    };

    await Promise.all([
      send("booking notification", () =>
        sendEmail({
          to: BOOKING_NOTIFICATION_EMAIL,
          subject: `New booking: ${data.customerName}, ${data.treatmentName}`,
          html: bookingNotificationHtml(data),
          ...(data.email && { replyTo: data.email }),
          ...(icsAttachment && { attachments: icsAttachment }),
        }),
      ),
      data.email
        ? send("booking acknowledgement", () =>
            sendEmail({
              to: data.email as string,
              subject: "We've received your appointment request",
              html: bookingAcknowledgementHtml(data),
              replyTo: BOOKING_NOTIFICATION_EMAIL,
              ...(icsAttachment && { attachments: icsAttachment }),
            }),
          )
        : Promise.resolve(),
    ]);

    return { success: true as const };
  });

export const listBookingsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as BookingRow[]).map(fromRow);
});

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
