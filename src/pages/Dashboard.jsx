import React, { useState } from "react";
import { Clock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, TIME_BOUNDARIES, formatRange } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import Pill from "../components/Pill.jsx";

export default function Dashboard() {
  const { lots, stalls, lotAvailability, myReservations, categoryAvailability } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(1);

  const upcoming = myReservations[myReservations.length - 1];

  return (
    <div className="p-6">
      <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">Dashboard</h2>

      <div className="mb-6 p-4 rounded-md max-w-xl bg-[var(--surface)] border border-[var(--border-c)]">
        {upcoming ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-display text-[var(--text-muted)]">Upcoming Reservation</div>
              <div className="font-display text-lg mt-1 text-[var(--text)]">
                {lots.find((l) => l.id === upcoming.lotId)?.name} — {venueConfig.spaceLabel} {stalls.find((s) => s.id === upcoming.stallId)?.label}
              </div>
              <div className="text-xs mt-1 flex items-center gap-1 text-[var(--text-muted)]">
                <Clock size={12} /> {upcoming.date} · {formatRange(upcoming.startIndex, upcoming.endIndex)}
              </div>
            </div>
            <Pill color="#4CAF6D">Confirmed</Pill>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-display text-[var(--text-muted)]">No Active Reservation</div>
              <div className="text-sm mt-1 text-[var(--text)]">Book a {venueConfig.spaceLabel.toLowerCase()} ahead of time so you're not searching on arrival.</div>
            </div>
            <button
              onClick={() => navigate("/reserve")}
              className="px-4 py-2 rounded font-display text-xs uppercase bg-[#4CAF6D] text-[#0D1A12]"
            >
              Reserve a Spot
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 max-w-xl space-y-2">
        <div className="text-xs uppercase font-display flex items-center gap-1 text-[var(--text-muted)]">
          <Bell size={12} /> Notifications
        </div>
        {upcoming ? (
          <div className="text-sm px-3 py-2 rounded bg-[#FFC72C11] text-[#FFC72C] border border-[var(--border-c)]">
            Reminder: your reservation at {lots.find((l) => l.id === upcoming.lotId)?.name} is on {upcoming.date} ({formatRange(upcoming.startIndex, upcoming.endIndex)}).
          </div>
        ) : (
          <div className="text-sm px-3 py-2 rounded bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border-c)]">
            No new notifications.
          </div>
        )}
      </div>

      <h3 className="font-display text-sm uppercase mb-3 text-[var(--text-secondary)]">
        Live Availability — {selectedDate} · {formatRange(startIndex, endIndex)}
      </h3>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]"
        />
        <select
          value={startIndex}
          onChange={(e) => {
            const newStart = Number(e.target.value);
            setStartIndex(newStart);
            if (endIndex <= newStart) setEndIndex(newStart + 1);
          }}
          className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]"
        >
          {TIME_BOUNDARIES.slice(0, -1).map((t, i) => (
            <option key={i} value={i}>{t}</option>
          ))}
        </select>
        <select
          value={endIndex}
          onChange={(e) => setEndIndex(Number(e.target.value))}
          className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]"
        >
          {TIME_BOUNDARIES.map((t, i) => (i > startIndex ? <option key={i} value={i}>{t}</option> : null))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { category: "student", label: "Student" },
          { category: "employee", label: "Employee" },
          { category: "faculty", label: "Faculty/Dept Head" },
        ].map((c) => {
          const { total, available } = categoryAvailability(c.category, selectedDate, startIndex, endIndex);
          return (
            <div key={c.category} className="p-4 rounded-md bg-[var(--surface)] border border-[var(--border-c)]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm uppercase text-[var(--text)]">{c.label}</span>
              </div>
              <div className="text-3xl font-display" style={{ color: available > 0 ? "#4CAF6D" : "#E67E22" }}>
                {available}/{total}
              </div>
            <div className="text-xs text-[var(--text-muted)]">stalls open</div>
          </div>
          );
        })}
      </div>
    </div>
  );
}