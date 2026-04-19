# 💰 FinSmart AI Advisor

> A smart, dynamic personal finance assistant powered by **Google Gemini AI** — built for Virtual: PromptWars by Hack2Skill.

---

## 🎯 Chosen Vertical
**Finance Advisor** — Helping everyday users make smarter financial decisions through conversational AI, expense tracking, and budget planning.

---

## 🚀 Live Demo
[Live on Google Cloud Run →](YOUR_CLOUD_RUN_URL)

---

## 🧠 Approach & Logic

FinSmart AI Advisor solves a real problem: most people don't have access to a personal finance advisor. This app brings that expertise to anyone, instantly.

**Core Logic:**
1. User asks a financial question in natural language
2. Gemini AI processes it with a finance-specific system prompt tuned for Indian users
3. Response is delivered in a clean chat interface
4. Users can track expenses in the dashboard
5. Expense data is saved to Google Sheets for persistence and analysis

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 💬 AI Chat | Ask any finance question, powered by Gemini 1.5 Flash |
| 📊 Expense Tracker | Add, categorize, and view your expenses |
| 📈 Budget Visualizer | See spending vs budget by category (bar chart) |
| 💾 Google Sheets Sync | Save all expenses to a connected Google Sheet |
| 🔐 Secure API | Input sanitization, error handling, no sensitive data leaks |
| ♿ Accessible UI | ARIA labels, keyboard navigation, screen reader friendly |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash API
- **Data Storage**: Google Sheets API v4
- **Auth/Credentials**: Google Service Account
- **Deployment**: Google Cloud Run (Docker)
- **Testing**: Jest + Supertest

---

## 📁 Project Structure

```
finsmart/
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app + routing
│   │   ├── App.css           # Global styles
│   │   └── components/
│   │       ├── Chat.jsx      # AI chat interface
│   │       └── Dashboard.jsx # Expense tracker + charts
│   ├── index.html
│   └── package.json
├── backend/
│   ├── server.js             # Express API server
│   ├── __tests__/
│   │   └── server.test.js    # Jest test suite
│   ├── .env.example          # Environment variables template
│   └── package.json
├── Dockerfile                # Multi-stage Docker build
└── README.md
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get here](https://aistudio.google.com/app/apikey))
- Google Cloud project with Sheets API enabled

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/finsmart-ai-advisor.git
cd finsmart-ai-advisor
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### 4. Run Tests
```bash
cd backend
npm test
```

---

## 🐳 Deploy to Google Cloud Run

```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/finsmart

# Deploy to Cloud Run
gcloud run deploy finsmart \
  --image gcr.io/YOUR_PROJECT_ID/finsmart \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,GOOGLE_SHEET_ID=your_id
```

---

## 🔒 Assumptions Made

1. Target users are Indian (currency defaults to ₹ INR)
2. Google Sheets used as a lightweight DB (no SQL server needed for MVP)
3. Budget limits are default starting values; users can extend this feature
4. Gemini 1.5 Flash chosen for speed and cost efficiency

---

## 📊 Evaluation Criteria Coverage

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | Clean component separation, consistent naming, modular structure |
| **Security** | Input sanitization, .env for secrets, no keys in code |
| **Efficiency** | Multi-stage Docker build, Gemini Flash model, lazy loading |
| **Testing** | Jest test suite covering API validation and edge cases |
| **Accessibility** | ARIA labels, roles, keyboard support, semantic HTML |
| **Google Services** | Gemini AI API + Google Sheets API v4 |

---

## 👤 Author

**Prathamesh Kailas Damdar**
Built for Virtual: PromptWars — Hack2Skill 2026

---

*FinSmart AI does not provide certified financial advice. Always consult a qualified financial advisor for major decisions.*
