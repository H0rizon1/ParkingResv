import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MapPin, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { venueConfig } from "../config/venueConfig.js";
import Pill from "./Pill.jsx";

const tabClass = ({ isActive }) =>
  `px-4 py-2 rounded-t-md transition-colors uppercase font-display text-sm ${
    isActive ? "text-[#FFC72C] border-b-[3px] border-[#FFC72C] bg-[#1F2226]" : "text-[#C9CBC7] border-b-[3px] border-transparent"
  }`;

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3F45]">
        <div className="flex items-center gap-2">
          <MapPin size={20} color="#FFC72C" />
          <span className="font-display text-lg uppercase text-[#F5F4F0]">{venueConfig.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Pill color={user.role === "admin" ? "#FFC72C" : "#4CAF6D"}>{user.role === "admin" ? "Admin" : "Student"}</Pill>
          <span className="text-sm text-[#C9CBC7]">{user.name}</span>
          <button onClick={handleLogout} className="p-2 rounded hover:opacity-80 text-[#C9CBC7]">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-3 border-b border-[#3A3F45]">
        <div className="flex gap-1">
          {user.role === "admin" ? (
            <NavLink to="/admin" className={tabClass}>Admin Panel</NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" className={tabClass}>Dashboard</NavLink>
              <NavLink to="/reserve" className={tabClass}>Reserve</NavLink>
              <NavLink to="/my-reservations" className={tabClass}>My Reservations</NavLink>
              <NavLink to="/profile" className={tabClass}>Profile</NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
}
