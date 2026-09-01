import React from "react";
import { Car } from "lucide-react";

export default function StallIcon({ status }) {
  // status: available | reserved | selected
  const border = status === "reserved" ? "#E2574C" : status === "selected" ? "#FFC72C" : "#4CAF6D";
  return (
    <div
      className="relative w-full aspect-[3/4] rounded-[2px] flex items-center justify-center transition-all"
      style={{
        background: status === "reserved" ? "#2A1E1D" : status === "selected" ? "#2E2A18" : "#1A2420",
        border: `2px solid ${border}`,
      }}
    >
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: border }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: border }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: border }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: border }} />
      <Car size={18} color={border} strokeWidth={2} style={{ opacity: status === "available" ? 0.25 : 1 }} />
    </div>
  );
}
