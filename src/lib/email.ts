import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "ShaadiSetu <onboarding@resend.dev>";

let cached: Resend | null = null;
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export interface EnquiryEmailInput {
  name: string;
  phone: string;
  eventDate: string;
  eventType: string;
  requirements: string;
}

export async function sendNewEnquiryEmail(
  vendor: { email: string | null; name: string },
  enquiry: EnquiryEmailInput,
): Promise<void> {
  if (!vendor.email) return;
  const c = client();
  if (!c) return; // dev/test no-op when RESEND_API_KEY is unset

  const subject = `New enquiry from ${enquiry.name} on ShaadiSetu`;
  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
      <h2 style="color: #be185d;">You have a new enquiry, ${vendor.name}!</h2>
      <p><strong>${enquiry.name}</strong> (${enquiry.phone}) is interested in your services.</p>
      <ul style="line-height: 1.6;">
        <li>Event date: ${enquiry.eventDate}</li>
        <li>Event type: ${enquiry.eventType}</li>
        <li>Requirements: ${enquiry.requirements}</li>
      </ul>
      <p>Log in to your dashboard to respond.</p>
    </div>
  `;
  await c.emails.send({ from: FROM, to: vendor.email, subject, html });
}

export interface CuratedRequestEmailInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const CURATED_INBOX = process.env.CURATED_INBOX ?? "hello@shaadisetu.com";

export async function sendCuratedRequestEmail(
  input: CuratedRequestEmailInput,
): Promise<void> {
  const c = client();
  if (!c) return; // dev/test no-op when RESEND_API_KEY is unset

  const subject = `Curated request from ${input.name}`;
  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (ch) =>
      ch === "&"
        ? "&amp;"
        : ch === "<"
          ? "&lt;"
          : ch === ">"
            ? "&gt;"
            : ch === "\""
              ? "&quot;"
              : "&#39;",
    );
  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
      <h2 style="color: #be185d;">New curated request</h2>
      <p><strong>${escape(input.name)}</strong> sent a request from the footer.</p>
      <ul style="line-height: 1.6;">
        <li>Email: <a href="mailto:${escape(input.email)}">${escape(input.email)}</a></li>
        <li>Phone: ${input.phone ? escape(input.phone) : "—"}</li>
      </ul>
      <p style="white-space: pre-wrap; border-left: 3px solid #be185d; padding-left: 12px; color: #333;">${escape(input.message)}</p>
    </div>
  `;
  await c.emails.send({
    from: FROM,
    to: CURATED_INBOX,
    replyTo: input.email,
    subject,
    html,
  });
}
