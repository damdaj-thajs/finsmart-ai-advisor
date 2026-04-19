import { useState } from "react";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">FinSmart <span className="accent">AI</span></span>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            💬 AI Advisor
          </button>
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === "chat" ? <Chat /> : <Dashboard />}
      </main>

      <footer className="footer">
        <p>FinSmart AI · Powered by Google Gemini · Built for #PromptWars</p>
      </footer>
    </div>
  );
}
