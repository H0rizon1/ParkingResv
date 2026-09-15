import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Login() {
  const { login, showToast, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(form);
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full font-body flex items-center justify-center p-6 bg-[var(--bg)]">
      <div className="w-full max-w-md">
        <Link to="/" className="text-xs mb-4 font-display uppercase text-[var(--text-muted)] inline-block">← Back</Link>
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <h1 className="font-display text-3xl uppercase mb-1 text-[var(--text)]">Log In</h1>
        <p className="text-sm mb-6 text-[var(--text-muted)]">Access your dashboard and reservations</p>

        <form onSubmit={handleSubmit} className="p-6 rounded-md space-y-4 bg-[var(--surface)] border border-[var(--border-c)]">
          <div>
            <label className="text-xs uppercase font-display text-[var(--text-secondary)]">{venueConfig.idFieldLabel}</label>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              placeholder={venueConfig.idFieldPlaceholder}
            />
          </div>
          <div>
            <label className="text-xs uppercase font-display text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            onClick={() => showToast("Password reset link sent (demo)", "ok")}
            className="text-xs text-[var(--text-muted)]"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            className="w-full py-3 rounded font-display uppercase tracking-wide flex items-center justify-center gap-2 bg-[#4CAF6D] text-[#0D1A12]"
          >
            Log In <ChevronRight size={16} />
          </button>
          <p className="text-xs text-center text-[var(--text-muted)]">
            No account? <Link to="/register" className="underline text-[#FFC72C]">Sign up</Link>
          </p>
        </form>

        {toast && (
          <div className="mt-4 px-4 py-2 rounded font-body text-sm bg-[#E2574C22] text-[#E2574C]">
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
