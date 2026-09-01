import React from "react";
import { MapPin, Clock, Car, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function MyReservations() {
  const { lots, stalls, myReservations, cancelReservation } = useApp();

  return (
    <div className="p-6">
      <h2 className="font-display text-xl uppercase mb-4 text-[#F5F4F0]">My Reservations</h2>
      {myReservations.length === 0 ? (
        <p className="text-sm text-[#8B8E92]">No reservations yet. Head to the Reserve tab to book a stall.</p>
      ) : (
        <div className="space-y-3 max-w-xl">
          {myReservations.map((r) => {
            const lot = lots.find((l) => l.id === r.lotId);
            return (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-md bg-[#2E3238] border border-[#3A3F45]">
                <div>
                  <div className="font-display text-sm uppercase text-[#F5F4F0]">{lot?.name}</div>
                  <div className="text-xs flex items-center gap-3 mt-1 text-[#8B8E92]">
                    <span className="flex items-center gap-1"><MapPin size={12} /> Stall {stalls.find((s) => s.id === r.stallId)?.label}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {r.date} · {r.slot}</span>
                    {r.vehiclePlate && <span className="flex items-center gap-1"><Car size={12} /> {r.vehiclePlate}</span>}
                  </div>
                </div>
                <button onClick={() => cancelReservation(r.id)} className="p-2 rounded text-[#E2574C]">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
