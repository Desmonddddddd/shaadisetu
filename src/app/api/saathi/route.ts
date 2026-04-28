import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import {
  SAATHI_SYSTEM_PROMPT,
  SAATHI_SITE_KNOWLEDGE,
} from "@/data/saathi-knowledge";

// Streaming chat endpoint for SAATHI. Returns plain-text deltas over a
// ReadableStream so the client can render tokens as they arrive. The system
// prompt + site knowledge are sent as a cached prefix — every turn reuses the
// same prefix and only pays for the tail.

export const runtime = "nodejs";
// Allow long-running streams; default 60s would cut off mid-answer.
export const maxDuration = 60;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

export async function POST(request: Request) {
  // 20 messages per 5 minutes per IP — generous for a real conversation,
  // tight enough to deter abuse.
  const limit = rateLimit(`${getClientIp(request)}:saathi`, 20, 5 * 60 * 1000);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        error: "You're going a bit fast. Give it a minute and try again.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "SAATHI is not configured yet." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid message payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // System prompt as two blocks so we can mark the (large) site knowledge
  // block cacheable. The tail (persona) is small enough that the marginal
  // cost is negligible.
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: `${SAATHI_SYSTEM_PROMPT}\n\n---\n\n${SAATHI_SITE_KNOWLEDGE}`,
      cache_control: { type: "ephemeral" },
    },
  ];

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system,
    thinking: { type: "adaptive" },
    messages: parsed.data.messages,
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta" &&
            event.delta.text
          ) {
            const payload = JSON.stringify({ type: "text", text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (e) {
        console.error("[saathi] stream error", e);
        const payload = JSON.stringify({
          type: "error",
          message:
            "SAATHI lost the thread. Mind asking that again in a moment?",
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
