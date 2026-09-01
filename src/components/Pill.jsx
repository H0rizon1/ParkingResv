import React from "react";

export default function Pill({ children, color = "#C9CBC7" }) {
  return (
    <span className="font-body text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}
