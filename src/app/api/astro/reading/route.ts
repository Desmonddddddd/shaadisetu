import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { astroReadingInputSchema } from "@/lib/validators";
import { getKundli } from "@/lib/prokerala";
import {
  ASTRO_READING_SYSTEM,
  buildReadingPrompt,
} from "@/lib/astro-narrative";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const limit = rateLimit(`${getClientIp(request)}:astro-reading`, 10, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Slow down — try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = astroReadingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { person, focus, narrative } = parsed.data;
  const result = await getKundli(person);

  if (!narrative) {
    return NextResponse.json({ ok: true, result }, { status: 200 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: true, result, narrativeUnavailable: true },
      { status: 200 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: ASTRO_READING_SYSTEM,
      cache_control: { type: "ephemeral" },
    },
  ];
  const userMessage = buildReadingPrompt(result, person, focus);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMessage }],
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const meta = JSON.stringify({ type: "result", result });
        controller.enqueue(encoder.encode(`data: ${meta}\n\n`));
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
        console.error("[astro.reading] stream error", e);
        const payload = JSON.stringify({
          type: "error",
          message: "Could not generate the reading. Try again in a moment.",
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
