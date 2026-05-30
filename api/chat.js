const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages harus berupa array" });
    }

    const systemText = `Kamu adalah NutriBot AI, asisten nutrisi cerdas untuk aplikasi SmartMeal.
Gunakan Bahasa Indonesia yang ramah, informatif, singkat dan langsung ke inti.
Fokus: nutrisi, makanan, kalori, diet, kesehatan, olahraga, meal plan.
ATURAN FORMAT: jangan gunakan #, *, atau markdown. Judul huruf kapital. Gunakan (-) untuk poin. Maksimal 5 poin per bagian.`;

    const chatMessages = [
      { role: "system", content: systemText },
      ...messages,
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      messages: chatMessages,
    });

    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan saat menghubungi AI",
      detail: error.message,
    });
  }
}