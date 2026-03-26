const Groq     = require("groq-sdk");
const AppError = require("../utils/AppError");

// Lazy singleton — instantiated on first request so the server boots
// even before GROQ_API_KEY is set (useful for local dev startup).
let _groq = null;
const getGroq = () => {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      throw new AppError("GROQ_API_KEY is not configured in server/.env", 503);
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

const SYSTEM_PROMPT = `You are ROVER — the AI marketing assistant for REVOLVER, a bold digital marketing agency based in Georgia.

Your personality: Direct, sharp, confident. No fluff. You speak like a senior strategist who's seen it all and delivers real value fast.

## About REVOLVER
REVOLVER is a full-service digital marketing agency specializing in:
- **Social Media Marketing** — Instagram, Facebook, LinkedIn organic + paid growth
- **Content Marketing** — Strategy, copywriting, video scripts, blog content
- **Digital Advertising** — Meta Ads, Google Ads, TikTok Ads — performance-driven campaigns
- **Audio Branding** — Sonic identity, brand music, jingles, podcast production
- **TikTok Growth Packages** — Short-form video strategy, filming, editing, posting

## Pricing (monthly)
- **Starter Plan** — 1,500₾/mo — Perfect for emerging brands
- **Business Plan** — 2,500₾/mo ⭐ Most Popular — For scaling businesses
- **Premium Plan** — 3,500₾/mo — Full-service, white-glove treatment

**Add-ons:**
- Reel Production: 350₾
- Google Ads Setup: 600₾
- Audio Branding Package: 300₾

**TikTok Packages:**
- Starter: 1,200₾/mo
- Growth: 2,000₾/mo

## How you respond
- Be concise. Lead with the answer.
- If someone asks about pricing, give the numbers directly.
- If someone needs a custom quote or wants to start, tell them to visit the contact form at /about or email the team.
- You can give genuine marketing advice — tips, frameworks, strategy.
- Don't make up client results or fake statistics.
- Keep responses under 200 words unless detail is specifically needed.
- Never say "As an AI" — you're ROVER, REVOLVER's assistant.
- If asked something outside marketing/agency scope, politely redirect.`;

/**
 * POST /api/ai/chat
 * Body: { messages: [{role, content}] }
 * Streams SSE: data: {"content":"..."}\n\n  →  data: [DONE]\n\n
 */
const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return next(new AppError("messages array is required", 400));
    }

    // Validate each message
    const valid = messages.every(
      (m) => m && typeof m.role === "string" && typeof m.content === "string"
    );
    if (!valid) {
      return next(new AppError("Each message must have role and content strings", 400));
    }

    // SSE headers
    res.setHeader("Content-Type",  "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection",    "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // nginx: disable buffering
    res.flushHeaders();

    const stream = await getGroq().chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      max_tokens:  512,
      temperature: 0.7,
      stream:      true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-12), // keep last 12 messages for context window
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    // If headers already sent, end the stream with an error event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    } else {
      next(new AppError(err.message || "AI service error", 502));
    }
  }
};

module.exports = { chat };
