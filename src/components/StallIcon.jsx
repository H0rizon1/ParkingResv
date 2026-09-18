import React from "react";
import { Car } from "lucide-react";

export default function StallIcon({ status, orientation = "v" }) {
  const border =
    status === "reserved" ? "#E2574C" :
    status === "selected" ? "#FFC72C" :
    status === "restricted" ? "#5A5D62" :
    "#4CAF6D";

  const bg =
    status === "reserved" ? "#3A2A1D" :
    status === "selected" ? "#3A331A" :
    status === "restricted" ? "var(--surface)" :
    "#1A2420";

  return (
    <div
      className={`relative w-full ${orientation === "h" ? "aspect-[4/3]" : "aspect-[3/4]"} rounded-[2px] flex items-center justify-center transition-all`}
      style={{ background: bg, border: `2px solid ${border}` }}
    >
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: border }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: border }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: border }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: border }} />
      <Car
        size={18}
        color={border}
        strokeWidth={2}
        style={{ opacity: status === "available" ? 0.25 : status === "restricted" ? 0.2 : 1}}
      />
    </div>
  );
}
