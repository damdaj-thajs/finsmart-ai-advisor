import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Housing", "Entertainment", "Health", "Shopping", "Other"];

const INITIAL_BUDGET = {
  Food: 5000,
  Transport: 2000,
  Housing: 10000,
  Entertainment: 3000,
  Health: 2000,
  Shopping: 4000,
  Other: 2000,
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([
    { name: "Groceries", amount: 1200, category: "Food", date: "2026-04-18" },
    { name: "Metro pass", amount: 500, category: "Transport", date: "2026-04-17" },
    { name: "Netflix", amount: 649, category: "Entertainment", date: "2026-04-15" },
  ]);
  const [form, setForm] = useState({ name: "", amount: "", category: "Food" });
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBudget = Object.values(INITIAL_BUDGET).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;

  const spentByCategory = CATEGORIES.map((cat) => ({
    cat,
    spent: expenses.filter((e) => e.category === cat).reduce((s, e) => s + Number(e.amount), 0),
    budget: INITIAL_BUDGET[cat],
  }));

  const addExpense = () => {
    if (!form.name || !form.amount) return;
    setExpenses((prev) => [
      { ...form, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    setForm({ name: "", amount: "", category: "Food" });
  };

  const saveToSheets = async () => {
    setSaving(true);
    try {
      await fetch("/api/save-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      });
      showToast("✅ Saved to Google Sheets!");
    } catch {
      showToast("⚠️ Could not save. Check connection.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const maxSpent = Math.max(...spentByCategory.map((c) => c.budget), 1);

  return (
    <div className="dashboard" role="main" aria-label="Finance Dashboard">
      <div className="dashboard-header">
        <h2>📊 Finance Dashboard</h2>
        <p>Track your expenses and manage your budget</p>
      </div>

      {/* STATS */}
      <div className="stats-grid" role="region" aria-label="Financial summary">
        <div className="stat-card" aria-label={`Total budget: ₹${totalBudget.toLocaleString()}`}>
          <div className="stat-label">Monthly Budget</div>
          <div className="stat-value gold">₹{totalBudget.toLocaleString()}</div>
        </div>
        <div className="stat-card" aria-label={`Total spent: ₹${totalSpent.toLocaleString()}`}>
          <div className="stat-label">Total Spent</div>
          <div className="stat-value red">₹{totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card" aria-label={`Remaining: ₹${remaining.toLocaleString()}`}>
          <div className="stat-label">Remaining</div>
          <div className={`stat-value ${remaining >= 0 ? "green" : "red"}`}>
            ₹{remaining.toLocaleString()}
          </div>
        </div>
        <div className="stat-card" aria-label={`Total transactions: ${expenses.length}`}>
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
      </div>

      <div className="panels">
        {/* ADD EXPENSE */}
        <div className="panel" role="region" aria-label="Add expense">
          <h3>➕ Add Expense</h3>
          <div className="expense-form">
            <input
              className="input"
              placeholder="Expense name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-label="Expense name"
            />
            <div className="form-row">
              <input
                className="input"
                type="number"
                placeholder="Amount (₹)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                aria-label="Expense amount in rupees"
              />
              <select
                className="select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                aria-label="Expense category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="add-btn" onClick={addExpense} aria-label="Add expense">
              Add Expense
            </button>
          </div>

          <h3 style={{ marginTop: "1.5rem" }}>🧾 Recent Expenses</h3>
          <div className="expense-list" aria-label="Recent expense list" role="list">
            {expenses.length === 0 && <p className="empty">No expenses yet</p>}
            {expenses.map((e, i) => (
              <div key={i} className="expense-item" role="listitem">
                <div>
                  <div>{e.name}</div>
                  <div className="expense-cat">{e.category} · {e.date}</div>
                </div>
                <div className="expense-amount">-₹{Number(e.amount).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BUDGET CHART */}
        <div className="panel" role="region" aria-label="Budget by category">
          <h3>📈 Budget vs Spent</h3>
          <div className="bar-chart" aria-label="Bar chart showing budget vs spending by category">
            {spentByCategory.map(({ cat, spent, budget }) => (
              <div key={cat} className="bar-row" aria-label={`${cat}: spent ₹${spent} of ₹${budget} budget`}>
                <div className="bar-label">{cat}</div>
                <div className="bar-track" role="progressbar" aria-valuenow={spent} aria-valuemax={budget}>
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min((spent / maxSpent) * 100, 100)}%`,
                      background: spent > budget ? "#ff4d6d" : "var(--accent)",
                    }}
                  />
                </div>
                <div className="bar-val">₹{spent.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <button
            className="save-btn"
            onClick={saveToSheets}
            disabled={saving}
            aria-label="Save expenses to Google Sheets"
          >
            {saving ? "Saving..." : "💾 Save to Google Sheets"}
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast" role="alert" aria-live="assertive">
          {toast}
        </div>
      )}
    </div>
  );
}
