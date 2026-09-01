import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";

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
    <div className="min-h-screen w-full font-body flex items-center justify-center p-6 bg-[#1F2226]">
      <div className="w-full max-w-md">
        <Link to="/" className="text-xs mb-4 font-display uppercase text-[#8B8E92] inline-block">← Back</Link>
        <h1 className="font-display text-3xl uppercase mb-1 text-[#F5F4F0]">Log In</h1>
        <p className="text-sm mb-6 text-[#8B8E92]">Access your dashboard and reservations</p>

        <form onSubmit={handleSubmit} className="p-6 rounded-md space-y-4 bg-[#2E3238] border border-[#3A3F45]">
          <div>
            <label className="text-xs uppercase font-display text-[#C9CBC7]">{venueConfig.idFieldLabel}</label>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[#1F2226] text-[#F5F4F0] border border-[#3A3F45]"
              placeholder={venueConfig.idFieldPlaceholder}
            />
          </div>
          <div>
            <label className="text-xs uppercase font-display text-[#C9CBC7]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded outline-none bg-[#1F2226] text-[#F5F4F0] border border-[#3A3F45]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            onClick={() => showToast("Password reset link sent (demo)", "ok")}
            className="text-xs text-[#8B8E92]"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            className="w-full py-3 rounded font-display uppercase tracking-wide flex items-center justify-center gap-2 bg-[#4CAF6D] text-[#0D1A12]"
          >
            Log In <ChevronRight size={16} />
          </button>
          <p className="text-xs text-center text-[#8B8E92]">
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
