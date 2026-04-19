import { useState, useRef, useEffect } from "react";

const QUICK_PROMPTS = [
  "How do I start investing?",
  "Best way to save for retirement?",
  "How to reduce debt fast?",
  "Explain SIP vs lump sum",
  "What is the 50/30/20 rule?",
];

const WELCOME = {
  role: "ai",
  text: `👋 Hello! I'm your **FinSmart AI Advisor** powered by Google Gemini.\n\nI can help you with:\n• 💰 Budgeting & saving strategies\n• 📈 Investment advice\n• 🏦 Debt management\n• 📊 Financial planning\n\nWhat financial question can I help you with today?`,
};

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container" role="main" aria-label="AI Finance Chat">
      <div className="chat-header">
        <h2>💬 AI Financial Advisor</h2>
        <p>Powered by Google Gemini · Ask me anything about money</p>
      </div>

      <div className="quick-prompts" role="navigation" aria-label="Quick questions">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            className="quick-btn"
            onClick={() => sendMessage(q)}
            aria-label={`Quick question: ${q}`}
          >
            {q}
          </button>
        ))}
      </div>

      <div
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`} aria-label={`${msg.role === "ai" ? "AI" : "You"}: ${msg.text}`}>
            <div className="avatar" aria-hidden="true">
              {msg.role === "ai" ? "🤖" : "👤"}
            </div>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message ai" aria-label="AI is typing">
            <div className="avatar" aria-hidden="true">🤖</div>
            <div className="bubble">
              <div className="typing" aria-label="Loading">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Ask me about budgeting, investing, saving..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          aria-label="Type your financial question"
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          Send →
        </button>
      </div>
    </div>
  );
}
