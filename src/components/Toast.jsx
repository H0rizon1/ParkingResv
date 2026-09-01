import React from "react";
import { Check, X } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const color = toast.tone === "ok" ? "#4CAF6D" : toast.tone === "warn" ? "#FFC72C" : "#E2574C";

  return (
    <div
      className="mx-6 mt-4 px-4 py-2 rounded font-body text-sm flex items-center gap-2 w-fit"
      style={{ background: `${color}22`, color, border: `1px solid ${color}` }}
    >
      {toast.tone === "ok" ? <Check size={14} /> : <X size={14} />}
      {toast.msg}
    </div>
  );
}
