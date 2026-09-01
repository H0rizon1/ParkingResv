import React, { useState } from "react";
import { Clock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, TIME_SLOTS } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import Pill from "../components/Pill.jsx";

export default function Dashboard() {
  const { lots, stalls, lotAvailability, myReservations } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);

  const upcoming = myReservations[myReservations.length - 1];

  return (
    <div className="p-6">
      <h2 className="font-display text-xl uppercase mb-4 text-[#F5F4F0]">Dashboard</h2>

      {/* current reservation status card */}
      <div className="mb-6 p-4 rounded-md max-w-xl bg-[#2E3238] border border-[#3A3F45]">
        {upcoming ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-display text-[#8B8E92]">Upcoming Reservation</div>
              <div className="font-display text-lg mt-1 text-[#F5F4F0]">
                {lots.find((l) => l.id === upcoming.lotId)?.name} — {venueConfig.spaceLabel} {stalls.find((s) => s.id === upcoming.stallId)?.label}
              </div>
              <div className="text-xs mt-1 flex items-center gap-1 text-[#8B8E92]">
                <Clock size={12} /> {upcoming.date} · {upcoming.slot}
              </div>
            </div>
            <Pill color="#4CAF6D">Confirmed</Pill>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-display text-[#8B8E92]">No Active Reservation</div>
              <div className="text-sm mt-1 text-[#F5F4F0]">Book a {venueConfig.spaceLabel.toLowerCase()} ahead of time so you're not searching on arrival.</div>
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

      {/* notifications strip */}
      <div className="mb-6 max-w-xl space-y-2">
        <div className="text-xs uppercase font-display flex items-center gap-1 text-[#8B8E92]">
          <Bell size={12} /> Notifications
        </div>
        {upcoming ? (
          <div className="text-sm px-3 py-2 rounded bg-[#FFC72C11] text-[#FFC72C] border border-[#3A3F45]">
            Reminder: your reservation at {lots.find((l) => l.id === upcoming.lotId)?.name} is on {upcoming.date} ({upcoming.slot}).
          </div>
        ) : (
          <div className="text-sm px-3 py-2 rounded bg-[#2E3238] text-[#8B8E92] border border-[#3A3F45]">
            No new notifications.
          </div>
        )}
      </div>

      <h3 className="font-display text-sm uppercase mb-3 text-[#C9CBC7]">
        Live Availability — {selectedDate} · {selectedSlot}
      </h3>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded text-sm bg-[#2E3238] text-[#F5F4F0] border border-[#3A3F45]"
        />
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="px-3 py-2 rounded text-sm bg-[#2E3238] text-[#F5F4F0] border border-[#3A3F45]"
        >
          {TIME_SLOTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {lots.map((lot) => {
          const { total, available } = lotAvailability(lot.id, selectedDate, selectedSlot);
          return (
            <div key={lot.id} className="p-4 rounded-md bg-[#2E3238] border border-[#3A3F45]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm uppercase text-[#F5F4F0]">{lot.name}</span>
                <Pill color={lot.zone === "Faculty" ? "#FFC72C" : "#4CAF6D"}>{lot.zone}</Pill>
              </div>
              <div className="text-3xl font-display" style={{ color: available > 0 ? "#4CAF6D" : "#E2574C" }}>
                {available}/{total}
              </div>
              <div className="text-xs text-[#8B8E92]">{venueConfig.spaceLabel.toLowerCase()}s open{venueConfig.showPricing ? ` · ₱${venueConfig.ratePerSlot}/slot` : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
