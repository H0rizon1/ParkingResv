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

      <div className="p-4 rounded-md mb-6 bg-[#2E3238] border border-[#3A3F45]">
        <div className="text-xs uppercase font-display mb-3 text-[#C9CBC7]">Personal Info</div>
        <div className="space-y-2 text-sm text-[#F5F4F0]">
          <div><span className="text-[#8B8E92]">Name:</span> {user.name}</div>
          <div><span className="text-[#8B8E92]">ID:</span> {user.idNum}</div>
          <div><span className="text-[#8B8E92]">Email:</span> {user.email}</div>
          <div className="flex items-center gap-2">
            <span className="text-[#8B8E92]">Role:</span> <Pill color={user.role === "admin" ? "#FFC72C" : "#4CAF6D"}>{user.role}</Pill>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-md bg-[#2E3238] border border-[#3A3F45]">
        <div className="text-xs uppercase font-display mb-3 text-[#C9CBC7]">Vehicles</div>
        <div className="space-y-2 mb-3">
          {user.vehicles.length === 0 ? (
            <p className="text-sm text-[#8B8E92]">No vehicles on file yet.</p>
          ) : (
            user.vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-2 px-3 py-2 rounded bg-[#1F2226] border border-[#3A3F45] text-sm text-[#F5F4F0]">
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
            className="flex-1 px-3 py-2 rounded text-sm bg-[#1F2226] text-[#F5F4F0] border border-[#3A3F45]"
          />
          <button onClick={handleAdd} className="px-4 py-2 rounded font-display text-xs uppercase flex items-center gap-1 bg-[#FFC72C] text-[#1F2226]">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
