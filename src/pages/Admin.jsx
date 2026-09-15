import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import Pill from "../components/Pill.jsx";

export default function Admin() {
  const { lots, addLot, reservations, stalls } = useApp();
  const [form, setForm] = useState({ name: "", zone: venueConfig.zones[0].value, rows: 1, cols: 6 });

  const handleAddLot = () => {
    if (!form.name) return;
    addLot(form.name, form.zone, form.rows, form.cols);
    setForm({ name: "", zone: "Student", rows: 1, cols: 6 });
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">Manage {venueConfig.locationLabel}s</h2>
        <div className="space-y-2 mb-6">
          {lots.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 rounded bg-[var(--surface)] border border-[var(--border-c)]">
              <span className="text-sm text-[var(--text)]">{l.name}</span>
              <Pill color={l.zone === venueConfig.zones[1]?.value ? "#FFC72C" : "#4CAF6D"}>
                {l.zone} · {l.rows * l.cols} {venueConfig.spaceLabel.toLowerCase()}s
                {venueConfig.showPricing ? ` · ₱${venueConfig.ratePerSlot}/slot` : ""}
              </Pill>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md space-y-3 bg-[var(--surface)] border border-[var(--border-c)]">
          <div className="font-display text-xs uppercase text-[var(--text-secondary)]">Add New {venueConfig.locationLabel}</div>
          <input
            placeholder={`${venueConfig.locationLabel} name`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
          />
          <div className="flex gap-2">
            <select
              value={form.zone}
              onChange={(e) => setForm({ ...form, zone: e.target.value })}
              className="flex-1 px-3 py-2 rounded text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
            >
              {venueConfig.zones.map((z) => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Rows"
              value={form.rows}
              onChange={(e) => setForm({ ...form, rows: e.target.value })}
              className="w-20 px-3 py-2 rounded text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
            />
            <input
              type="number"
              min="1"
              placeholder="Cols"
              value={form.cols}
              onChange={(e) => setForm({ ...form, cols: e.target.value })}
              className="w-20 px-3 py-2 rounded text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border-c)]"
            />
          </div>
          <button
            onClick={handleAddLot}
            className="w-full py-2 rounded font-display uppercase text-sm flex items-center justify-center gap-2 bg-[#FFC72C] text-[var(--bg)]"
          >
            <Plus size={14} /> Add Lot
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">All Reservations</h2>
        {reservations.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No reservations have been made yet.</p>
        ) : (
          <div className="space-y-2">
            {reservations.map((r) => {
              const lot = lots.find((l) => l.id === r.lotId);
              return (
                <div key={r.id} className="p-3 rounded text-sm bg-[var(--surface)] border border-[var(--border-c)]">
                  <div className="text-[var(--text)]">{r.user} — {lot?.name}</div>
                  <div className="text-xs mt-1 text-[var(--text-muted)]">
                    Stall {stalls.find((s) => s.id === r.stallId)?.label} · {r.date} · {r.slot} {r.vehiclePlate ? `· ${r.vehiclePlate}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
