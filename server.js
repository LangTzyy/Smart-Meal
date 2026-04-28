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
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages harus berupa array" });
    }

    const systemPrompt = `Kamu adalah NutriBot AI, asisten nutrisi cerdas untuk aplikasi SmartMeal.
      Jawab dalam Bahasa Indonesia dengan gaya ramah, informatif, dan to the point.
      Fokus pada topik: nutrisi, makanan, kalori, diet, kesehatan, olahraga, meal plan.
      Jika pertanyaan tidak relevan, tetap jawab singkat lalu arahkan ke topik nutrisi.

      ATURAN FORMAT JAWABAN:
      - Gunakan teks tebal untuk judul dengan format <b>Judul</b>
      - Gunakan tanda (-) untuk setiap poin
      - Gunakan baris kosong sebagai pemisah antar bagian
      - Maksimal 5 poin per bagian
      - Jangan gunakan tanda # atau * sama sekali
      - Jangan tulis dalam paragraf panjang

      CONTOH FORMAT YANG BENAR:

      <b>Manfaat Protein</b>

      Protein adalah nutrisi penting yang dibutuhkan tubuh setiap hari.

      <b>Manfaat Utama</b>

      - Membangun dan memperbaiki jaringan otot
      - Membuat kenyang lebih lama
      - Meningkatkan metabolisme tubuh
      - Menjaga kesehatan tulang dan kulit

      <b>Sumber Protein Terbaik</b>

      - Dada ayam, telur, ikan
      - Tahu, tempe, kacang-kacangan
      - Greek yogurt, susu rendah lemak

      Konsumsi protein yang disarankan adalah 0,8 hingga 1,2 gram per kilogram berat badan per hari.`;

    const chatMessages = [
      { role: "system", content: systemText },
      ...messages,
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Gratis, cepat, limit besar
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