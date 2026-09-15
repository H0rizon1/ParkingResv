import React, { useState } from "react";
import { Car, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import Pill from "../components/Pill.jsx";

export default function Profile() {
  const { user, addVehicle } = useApp();
  const [plate, setPlate] = useState("");

  const handleAdd = () => {
    if (!plate.trim()) return;
    addVehicle(plate.trim());
    setPlate("");
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="font-display text-xl uppercase mb-4 text-[#F5F4F0]">Profile</h2>

      <div className="p-4 rounded-md mb-6 bg-[var(--surface)] border border-[var(--border-c)]">
        <div className="text-xs uppercase font-display mb-3 text-[var(--text-secondary)]">Personal Info</div>
        <div className="space-y-2 text-sm text-[#F5F4F0]">
          <div><span className="text-[var(--text-muted)]">Name:</span> {user.name}</div>
          <div><span className="text-[var(--text-muted)]">ID:</span> {user.idNum}</div>
          <div><span className="text-[var(--text-muted)]">Email:</span> {user.email}</div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Role:</span> <Pill color={user.role === "admin" ? "#FFC72C" : "#4CAF6D"}>{user.role}</Pill>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-md bg-[var(--surface)] border border-[var(--border-c)]">
        <div className="text-xs uppercase font-display mb-3 text-[var(--text-secondary)]">Vehicles</div>
        <div className="space-y-2 mb-3">
          {user.vehicles.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No vehicles on file yet.</p>
          ) : (
            user.vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--bg)] border border-[var(--border-c)] text-sm text-[#F5F4F0]">
                <Car size={14} /> {v.plate}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="Add plate number (e.g. ABC 1234)"
            className="flex-1 px-3 py-2 rounded text-sm bg-[var(--bg)] text-[#F5F4F0] border border-[var(--border-c)]"
          />
          <button onClick={handleAdd} className="px-4 py-2 rounded font-display text-xs uppercase flex items-center gap-1 bg-[#FFC72C] text-[var(--bg)]">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
