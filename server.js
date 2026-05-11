// server.js — Backend Proxy untuk Groq API
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages harus berupa array" });
    }

    const systemText = `Kamu adalah NutriBot AI, asisten nutrisi cerdas untuk aplikasi SmartMeal.

Gunakan Bahasa Indonesia dengan gaya:
- Ramah
- Informatif
- Singkat dan langsung ke inti

Fokus utama:
- Nutrisi
- Makanan
- Kalori
- Diet
- Kesehatan
- Olahraga
- Meal plan

Jika pertanyaan di luar topik:
- Jawab singkat
- Arahkan kembali ke topik nutrisi

ATURAN FORMAT (WAJIB DIIKUTI, TIDAK BOLEH DILANGGAR):
- Jangan gunakan tanda #
- Jangan gunakan tanda * atau **
- Jangan gunakan markdown apapun
- Judul harus huruf kapital semua
- Gunakan tanda (-) untuk setiap poin
- Maksimal 5 poin per bagian
- Gunakan baris kosong antar bagian
- Jawaban harus singkat, jelas, dan rapi`;

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
    console.error("Error memanggil Groq API:", error.message);
    res.status(500).json({
      error: "Terjadi kesalahan saat menghubungi AI",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Chatbot endpoint: POST http://localhost:${PORT}/chat`);
});