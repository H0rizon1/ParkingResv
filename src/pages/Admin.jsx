import React from "react";
import { useApp, formatRange, compareByDateTime } from "../context/AppContext.jsx";
import Pill from "../components/Pill.jsx";

const CATEGORIES = [
  { category: "student", label: "Student", color: "#4CAF6D" },
  { category: "employee", label: "Employee", color: "#FFC72C" },
  { category: "faculty", label: "Faculty / Dept Head", color: "#E67E22" },
  { category: "pwd", label: "PWD (not yet bookable)", color: "#5A5D62" },
];

function getStatus(r) {
  return r.status || "approved"; // legacy reservations made before approval flow existed
}

export default function Admin() {
  const { lots, reservations, stalls, approveReservation, rejectReservation } = useApp();

  const pending = reservations
    .filter((r) => getStatus(r) === "pending")
    .sort(compareByDateTime);
  const approved = reservations.filter((r) => getStatus(r) === "approved");

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
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
          {approved.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No approved reservations yet.</p>
          ) : (
            <div className="space-y-2">
              {approved.map((r) => (
                <div key={r.id} className="p-3 rounded text-sm bg-[var(--surface)] border border-[var(--border-c)]">
                  <div className="text-[var(--text)]">{r.username} — Stall {stalls.find((s) => s.id === r.stallId)?.label}</div>
                  <div className="text-xs mt-1 text-[var(--text-muted)]">
                    {r.date} · {formatRange(r.startIndex, r.endIndex)} {r.vehiclePlate ? `· ${r.vehiclePlate}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl uppercase mb-1 text-[var(--text)]">Parking Req. Approval Section</h2>
        <p className="text-xs mb-4 text-[var(--text-muted)]">
          {pending.length} request{pending.length === 1 ? "" : "s"} waiting on your decision.
        </p>
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No pending requests right now.</p>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {pending.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between gap-4 p-3 rounded bg-[var(--surface)] border border-[var(--border-c)] flex-wrap">
                <div>
                  <div className="text-sm text-[var(--text)]">
                    {i + 1}. {r.username} — ID {r.userId}
                  </div>
                  <div className="text-xs mt-1 text-[var(--text-muted)]">
                    Stall {stalls.find((s) => s.id === r.stallId)?.label} · {r.date} · {formatRange(r.startIndex, r.endIndex)}
                    {r.vehiclePlate ? ` · ${r.vehiclePlate}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveReservation(r.id)}
                    className="px-3 py-2 rounded text-xs font-display uppercase tracking-wide"
                    style={{ background: "#4CAF6D", color: "#0D1A12" }}>
                    Approved
                  </button>
                  <button onClick={() => rejectReservation(r.id)}
                    className="px-3 py-2 rounded text-xs font-display uppercase tracking-wide"
                    style={{ background: "#E2574C", color: "#2A0E0B" }}>
                    Denied / Rejected
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}