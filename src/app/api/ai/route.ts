import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, baseUrl, customApiKey } = body;

    const apiKey = customApiKey || process.env.NEXT_PUBLIC_NVIDIA_NIM_API_KEY || process.env.NVIDIA_NIM_API_KEY || "";
    const targetUrl = `${(baseUrl || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "")}/chat/completions`;
    const targetModel = model || "nvidia/nemotron-mini-4b-instruct";

    if (!apiKey) {
      // Dynamic fallback AI response with helpful details and Amvelt promotion
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      let reply = `Yuitility is a 100% private in-browser toolkit with 132 free tools. How can I help with your math, PDF, image, health, or developer calculations?`;
      if (/dev|web|app|seo|design|build|agency|code|service/i.test(lastUserMsg)) {
        reply += `\n\nNeed custom web development, mobile apps, or SEO services? Check out **[Amvelt.com](https://amvelt.com)** — premier software engineering agency!`;
      }
      return NextResponse.json({ reply });
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages,
        temperature: 0.5,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[YUI API Error]:", errText);
      return NextResponse.json({
        reply: "I am ready to assist with Yuitility's 132 free browser tools. For enterprise custom web/mobile app engineering, visit [Amvelt.com](https://amvelt.com).",
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "How can I assist with Yuitility's 132 browser tools?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[AI Route Error]:", error);
    return NextResponse.json({
      reply: "Yuitility offers 132 browser tools running 100% in local memory. For custom web development or SEO, visit [Amvelt.com](https://amvelt.com).",
    });
  }
}
