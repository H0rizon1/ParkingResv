import React from "react";
import { useApp, formatRange } from "../context/AppContext.jsx";
import Pill from "../components/Pill.jsx";

const CATEGORIES = [
  { category: "student", label: "Student", color: "#4CAF6D" },
  { category: "employee", label: "Employee", color: "#FFC72C" },
  { category: "faculty", label: "Faculty / Dept Head", color: "#E67E22" },
  { category: "pwd", label: "PWD (not yet bookable)", color: "#5A5D62" },
];

export default function Admin() {
  const { lots, reservations, stalls } = useApp();

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">{lots[0].name}</h2>
        <div className="space-y-2">
          {CATEGORIES.map((c) => {
            const count = stalls.filter((s) => s.category === c.category).length;
            return (
              <div key={c.category} className="flex items-center justify-between p-3 rounded bg-[var(--surface)] border border-[var(--border-c)]">
                <span className="text-sm text-[var(--text)]">{c.label}</span>
                <Pill color={c.color}>{count} stalls</Pill>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-4 text-[var(--text-muted)]">
          Stall layout is fixed to the real Basement 1 floor plan — lots aren't added or edited here.
        </p>
      </div>

      <div>
        <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">All Reservations</h2>
        {reservations.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No reservations have been made yet.</p>
        ) : (
          <div className="space-y-2">
            {reservations.map((r) => (
              <div key={r.id} className="p-3 rounded text-sm bg-[var(--surface)] border border-[var(--border-c)]">
                <div className="text-[var(--text)]">{r.userName} — Stall {stalls.find((s) => s.id === r.stallId)?.label}</div>
                <div className="text-xs mt-1 text-[var(--text-muted)]">
                  {r.date} · {formatRange(r.startIndex, r.endIndex)} {r.vehiclePlate ? `· ${r.vehiclePlate}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}