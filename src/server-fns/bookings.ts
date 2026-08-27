import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
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

function bookingNotificationHtml(data: z.infer<typeof createBookingInput>) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;">${label}</td><td style="padding:4px 0;"><strong>${value}</strong></td></tr>`;

  return `
    <div style="font-family:sans-serif;font-size:15px;color:#222;">
      <p>A new appointment request came in on the website.</p>
      <table cellpadding="0" cellspacing="0">
        ${row("Name", data.customerName)}
        ${row("Phone", data.phone)}
        ${data.email ? row("Email", data.email) : ""}
        ${row("Treatment", data.treatmentName)}
        ${data.preferredDate ? row("Preferred date", data.preferredDate) : ""}
        ${data.preferredTime ? row("Preferred time", data.preferredTime) : ""}
        ${data.notes ? row("Notes", data.notes) : ""}
      </table>
      <p style="margin-top:16px;">
        <a href="https://signaturebylilian.com/admin/bookings">View in the admin dashboard</a>
      </p>
    </div>
  `;
}

export const createBookingFn = createServerFn({ method: "POST" })
  .validator(createBookingInput)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("bookings").insert({
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

    // Notification only — a failed email must never fail the booking itself.
    try {
      await sendEmail({
        to: BOOKING_NOTIFICATION_EMAIL,
        subject: `New booking: ${data.customerName} — ${data.treatmentName}`,
        html: bookingNotificationHtml(data),
      });
    } catch (emailError) {
      console.error("Failed to send booking notification email:", emailError);
    }

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
