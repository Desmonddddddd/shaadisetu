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
