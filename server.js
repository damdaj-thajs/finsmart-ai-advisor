const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend build
app.use(express.static(path.join(__dirname, "public")));

// ─── GEMINI AI CHAT ──────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message" });
  }

  // Sanitize input
  const sanitized = message.trim().slice(0, 1000);

  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are FinSmart, an expert personal finance advisor for Indian users. 
    Give practical, clear, and actionable financial advice. 
    Use Indian currency (₹/INR) where relevant. Keep responses concise (under 200 words).
    Do not give specific stock tips. Always remind users to consult a certified advisor for major decisions.
    
    User question: ${sanitized}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "AI service unavailable. Please try again." });
  }
});

// ─── SAVE TO GOOGLE SHEETS ───────────────────────────────────────
app.post("/api/save-expenses", async (req, res) => {
  const { expenses } = req.body;

  if (!Array.isArray(expenses)) {
    return res.status(400).json({ error: "Invalid expenses data" });
  }

  try {
    const { google } = require("googleapis");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const rows = expenses.map((e) => [
      e.date,
      e.name,
      e.category,
      `₹${e.amount}`,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["Date", "Expense", "Category", "Amount"],
          ...rows,
        ],
      },
    });

    res.json({ success: true, message: "Saved to Google Sheets!" });
  } catch (error) {
    console.error("Sheets error:", error.message);
    res.status(500).json({ error: "Could not save to Google Sheets." });
  }
});

// ─── HEALTH CHECK ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FinSmart AI Advisor", timestamp: new Date().toISOString() });
});

// ─── CATCH-ALL (SPA) ─────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ FinSmart server running on port ${PORT}`);
});

module.exports = app;
