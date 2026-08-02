import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are the CaribNexus AI assistant on our marketing website. You help visitors learn about our services and book consultations.

About CaribNexus AI:
- Caribbean Applied Artificial Intelligence company
- We build custom AI systems for Caribbean businesses
- Our flagship product is CaribBooks — AI bookkeeping via WhatsApp
- We offer AI consulting: analyze operations, identify waste, build systems that cut costs by up to 50%
- Based in Jamaica, serving the Caribbean region

CaribBooks features:
- Message on WhatsApp → journal entry posted automatically
- Double-entry bookkeeping (one debit, one credit, always balanced)
- One entry feeds all 11 financial reports in real time
- Built for JMD, GCT, TRN compliance

When users want to book a consultation, collect:
- Their name
- Business name and industry
- Email address
- What challenges they face
- Company size

Be concise, professional, warm. Caribbean-friendly but not casual. Keep responses under 3 sentences unless they ask for detail.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "api_key_missing" }), { status: 500 });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.6-luna",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      reasoning_effort: "low",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: res.status });
  }

  // Stream the response back
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {}
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
