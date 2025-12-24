import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
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
