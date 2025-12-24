// server/index.js
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

// Apply to all /api routes (or only translate route)
app.use("/api", rateLimit({ windowMs: 5 * 60 * 1000, max: 20 }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/translate", async (req, res) => {
  const { text, language } = req.body || {};

  if (!text || !language) {
    return res.status(400).json({ error: "Missing text or language" });
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // If behind proxies, this helps push chunks immediately
  res.flushHeaders?.();

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      input: [
        {
          role: "system",
          content:
            "You are a world class polyglott, who has 30 years experience teach and interpretting different languages. Return high level translations in French, Spanish, and Japanese into english.",
        },
        {
          role: "user",
          content: `Translate into ${language}:\n\n${text}`,
        },
      ],
    });

    return res.status(200).json({
      translatedText: response.output_text || "",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
