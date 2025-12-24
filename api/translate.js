import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const buckets = new Map();

function rateLimit(req, res, { windowMs = 60_000, max = 20 } = {}) {
  const key =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > max) {
    res.status(429).json({ error: "Too many requests. Try again soon." });
    return true;
  }

  return false;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (rateLimit(req, res)) return;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
        error: "Missing OPENAI_API_KEY on server",
        });
    }

    const { text, language } = req.body || {};

    // Guard rails.
    if (!text || !language) {
        return res.status(400).json({ error: "Missing text or language" });
    }

    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: "You are a world class polyglott, who has 30 years experience teach and interpretting different languages. Return high level translations in French, Spanish, and Japanese into english."
                },
                {
                    role: "user",
                    content: `Translate this into ${language}: \n\n${text}`,
                },
            ],
        });

        const translatedText = response.output_text || "Translation unavailable (empty output)."
        return res.status(200).json({ translatedText });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Translation failed" });
    }
}
