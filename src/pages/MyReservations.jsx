import React from "react";
import { MapPin, Clock, Car, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, formatRange, compareByDateTime } from "../context/AppContext.jsx";
import Pill from "../components/Pill.jsx";

const STATUS_STYLE = {
  pending: { label: "Pending Approval", color: "#FFC72C" },
  approved: { label: "Approved", color: "#4CAF6D" },
  rejected: { label: "Rejected", color: "#E2574C" },
};

export default function MyReservations() {
  const { lots, stalls, myReservations, cancelReservation } = useApp();
  const navigate = useNavigate();

  const sortedReservations = [...myReservations].sort(compareByDateTime);

  return (
    <div className="p-6">
      <h2 className="font-display text-xl uppercase mb-4 text-[var(--text)]">My Reservations</h2>
      {myReservations.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No reservations yet. Head to the Reserve tab to book a stall.</p>
      ) : (
        <div className="space-y-3 max-w-xl">
          {sortedReservations.map((r) => {
            const lot = lots.find((l) => l.id === r.lotId);
            const status = r.status || "approved";
            const statusInfo = STATUS_STYLE[status];
            return (
              <div key={r.id} className="p-4 rounded-md bg-[var(--surface)] border border-[var(--border-c)]">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm uppercase text-[var(--text)]">{lot?.name}</span>
                      <Pill color={statusInfo.color}>{statusInfo.label}</Pill>
                    </div>
                    <div className="text-xs flex items-center gap-3 mt-1 text-[var(--text-muted)]">
                      <span className="flex items-center gap-1"><MapPin size={12} /> Stall {stalls.find((s) => s.id === r.stallId)?.label}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {r.date} · {formatRange(r.startIndex, r.endIndex)}</span>
                      {r.vehiclePlate && <span className="flex items-center gap-1"><Car size={12} /> {r.vehiclePlate}</span>}
                    </div>
                  </div>
                  <button onClick={() => cancelReservation(r.id)} className="p-2 rounded text-[#E2574C]">
                    <Trash2 size={16} />
                  </button>
                </div>
                {status === "rejected" && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-c)] flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-[var(--text-muted)]">
                      This request was rejected by admin. Pick a different slot to try again.
                    </p>
                    <button onClick={() => navigate("/reserve")}
                      className="px-3 py-1.5 rounded text-xs font-display uppercase tracking-wide"
                      style={{ background: "#FFC72C", color: "#1F2226" }}>
                      Reserve Again
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}