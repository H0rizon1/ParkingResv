import React from "react";
import { useNavigate } from "react-router-dom";
import { ParkingSquare, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";

export default function Landing() {
  const { totalAvailableNow, toast } = useApp();
  const navigate = useNavigate();

  const steps = [
    { n: "01", t: `Select a ${venueConfig.locationLabel.toLowerCase()}`, d: "Choose the zone and time you need" },
    { n: "02", t: `Pick a ${venueConfig.spaceLabel.toLowerCase()}`, d: "See live availability, grab an open spot" },
    { n: "03", t: "Drive in", d: "Show up, park, no searching required" },
  ];

  return (
    <div className="min-h-screen w-full font-body flex flex-col items-center justify-center p-6 text-center bg-[#1F2226]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-[#FFC72C22]">
        <ParkingSquare size={14} color="#FFC72C" />
        <span className="font-display text-xs uppercase tracking-wide text-[#FFC72C]">{venueConfig.appName}</span>
      </div>

      <h1 className="font-display text-4xl md:text-5xl uppercase max-w-xl text-[#F5F4F0]">
        {venueConfig.tagline}
      </h1>
      <p className="text-sm mt-3 max-w-md text-[#8B8E92]">
        {venueConfig.subtext}
      </p>

      <div className="mt-6 px-5 py-3 rounded-md bg-[#2E3238] border border-[#3A3F45]">
        <span className="font-display text-2xl text-[#4CAF6D]">{totalAvailableNow}</span>
        <span className="text-sm ml-2 text-[#C9CBC7]">{venueConfig.spaceLabel.toLowerCase()}s open right now</span>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded font-display uppercase tracking-wide bg-[#2E3238] text-[#F5F4F0] border border-[#3A3F45]"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 rounded font-display uppercase tracking-wide flex items-center gap-2 bg-[#4CAF6D] text-[#0D1A12]"
        >
          Sign Up <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl text-left">
        {steps.map((step) => (
          <div key={step.n}>
            <div className="font-display text-xl text-[#FFC72C]">{step.n}</div>
            <div className="font-display text-sm uppercase mt-1 text-[#F5F4F0]">{step.t}</div>
            <div className="text-xs mt-1 text-[#8B8E92]">{step.d}</div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="mt-6 px-4 py-2 rounded font-body text-sm bg-[#E2574C22] text-[#E2574C] border border-[#E2574C]">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
