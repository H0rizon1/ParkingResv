import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Register() {
  const { register, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", id: "", email: "", password: "", plate: "", role: venueConfig.roles[0].value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = register(form);
    if (ok) navigate(form.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full font-body flex items-center justify-center p-6 bg-[var(--bg)]">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <Link to="/" className="text-xs mb-4 font-display uppercase text-[var(--text-muted)] inline-block">← Back</Link>
        <h1 className="font-display text-3xl uppercase mb-1 text-[var(--text)]">Create Account</h1>
        <p className="text-sm mb-6 text-[var(--text-muted)]">Register with your campus ID to start reserving</p>

        <form onSubmit={handleSubmit} className="p-6 rounded-md space-y-3 bg-[var(--surface)] border border-[var(--border-c)]">
          <div>
            <label className="text-xs uppercase font-display text-[var(--text-secondary)]">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs uppercase font-display text-[var(--text-secondary)]">{venueConfig.idFieldLabel}</label>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
                placeholder={venueConfig.idFieldPlaceholder}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs uppercase font-display text-[var(--text-secondary)]">Role (demo)</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              >
                {venueConfig.roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase font-display text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              placeholder="you@campus.edu"
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
          <div>
            <label className="text-xs uppercase font-display text-[var(--text-secondary)]">Vehicle plate number (optional)</label>
            <input
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
              placeholder="ABC 1234"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded font-display uppercase tracking-wide flex items-center justify-center gap-2 bg-[#4CAF6D] text-[#0D1A12]"
          >
            Create Account <ChevronRight size={16} />
          </button>
          <p className="text-xs text-center text-[var(--text-muted)]">
            Already have an account? <Link to="/login" className="underline text-[#FFC72C]">Log in</Link>
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