import React, { useState } from "react";
import { Car, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, TIME_BOUNDARIES } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import StallIcon from "../components/StallIcon.jsx";
import FloorPlan from "../components/FloorPlan.jsx";


export default function Reserve() {
  const { lots, stalls, user, isStallTaken, reserveStall, stallCategoryAllowed } = useApp();
  const navigate = useNavigate();
  const lotId = lots[0].id;

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(1);

  const handleConfirm = () => {
    if (!selectedStall || !selectedVehicle) return;
    const ok = reserveStall({
      stallId: selectedStall,
      lotId,
      date: selectedDate,
      startIndex,
      endIndex,
      vehiclePlate: selectedVehicle,
    });
    if (ok) navigate("/my-reservations");
  };

  return (
    <div className="p-6">
      <h2 className="font-display text-xl uppercase mb-1 text-[var(--text)]">Reserve a {venueConfig.spaceLabel}</h2>
      <p className="text-xs mb-4 text-[var(--text-muted)]">{lots[0].name}</p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]" />
        <select value={startIndex} onChange={(e) => {
            const newStart = Number(e.target.value);
            setStartIndex(newStart);
            if (endIndex <= newStart) setEndIndex(newStart + 1);
          }} className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]">
          {TIME_BOUNDARIES.slice(0, -1).map((t, i) => <option key={i} value={i}>{t}</option>)}
        </select>
        <select value={endIndex} onChange={(e) => setEndIndex(Number(e.target.value))}
          className="px-3 py-2 rounded text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border-c)]">
          {TIME_BOUNDARIES.map((t, i) => (i > startIndex ? <option key={i} value={i}>{t}</option> : null))}
        </select>
      </div>

      <div className="mb-5">
        <div className="text-xs uppercase font-display mb-2 text-[var(--text-secondary)]">Select Vehicle</div>
        {user.vehicles && user.vehicles.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {user.vehicles.map((v) => (
              <button key={v.id} onClick={() => setSelectedVehicle(v.plate)}
                className="px-3 py-2 rounded text-sm font-body flex items-center gap-2 border border-[var(--border-c)]"
                style={{ background: selectedVehicle === v.plate ? "#FFC72C" : "var(--surface)", color: selectedVehicle === v.plate ? "#1F2226" : "var(--text)" }}>
                <Car size={14} /> {v.plate}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            No vehicle on file — add one in your{" "}
            <button onClick={() => navigate("/profile")} className="underline text-[#FFC72C]">Profile</button>{" "}
            before reserving.
          </p>
        )}
      </div>

      <div className="mb-6">
  <div className="text-xs uppercase font-display mb-2 text-[var(--text-secondary)]">{lots[0].name}</div>
  <FloorPlan
    stalls={stalls}
    user={user}
    selectedStall={selectedStall}
    onSelect={setSelectedStall}
    isStallTaken={isStallTaken}
    selectedDate={selectedDate}
    startIndex={startIndex}
    endIndex={endIndex}
    stallCategoryAllowed={stallCategoryAllowed}
  />
</div>

      <div className="flex items-center gap-4 mb-4 text-xs text-[var(--text-muted)] flex-wrap">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-[#4CAF6D]" /> Available</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-[#E67E22]" /> Reserved</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-[#FFC72C]" /> Selected</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-[#5A5D62]" /> Not for your role</span>
      </div>

      <button onClick={handleConfirm} disabled={!selectedStall || !selectedVehicle}
        className="px-6 py-3 rounded font-display uppercase tracking-wide flex items-center gap-2"
        style={{ background: selectedStall && selectedVehicle ? "#4CAF6D" : "var(--border-c)", color: selectedStall && selectedVehicle ? "#0D1A12" : "var(--text-muted)" }}>
        Confirm Reservation <Check size={16} />
      </button>
    </div>
  );
}