import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { venueConfig } from "../config/venueConfig.js";

const AppContext = createContext(null);
const STORAGE_KEY = "campus-parking-data-v1";

const initialLots = [
  { id: "lotA", name: `${venueConfig.locationLabel} A — Main Building`, zone: venueConfig.zones[0].value, rows: 2, cols: 6 },
  { id: "lotB", name: `${venueConfig.locationLabel} B — East Wing`, zone: venueConfig.zones[0].value, rows: 2, cols: 5 },
  { id: "lotC", name: `${venueConfig.locationLabel} C — ${venueConfig.zones[1]?.label || "Reserved"}`, zone: venueConfig.zones[1]?.value || venueConfig.zones[0].value, rows: 1, cols: 6 },
];

export const TIME_SLOTS = [
  "7:00 – 9:00 AM",
  "9:00 – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "1:00 – 3:00 PM",
  "3:00 – 5:00 PM",
];

function buildStalls(lots) {
  const stalls = [];
  lots.forEach((lot) => {
    const total = lot.rows * lot.cols;
    for (let i = 1; i <= total; i++) {
      stalls.push({ id: `${lot.id}-${i}`, lotId: lot.id, label: `${lot.id.slice(-1).toUpperCase()}${i}` });
    }
  });
  return stalls;
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const persisted = useRef(loadPersisted()).current;
  const [lots, setLots] = useState(persisted?.lots || initialLots);
  const [stalls] = useState(() => buildStalls(persisted?.lots || initialLots));
  const [reservations, setReservations] = useState(persisted?.reservations || []);
  const [users, setUsers] = useState(persisted?.users || []);
  const [user, setUser] = useState(null); // session not restored — log in each visit
  const [toast, setToast] = useState(null);

  // Persist to localStorage so data survives refresh / offline use —
  // no server or network connection required.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lots, reservations, users }));
    } catch {
      // storage unavailable — fail silently, app still works in-memory
    }
  }, [lots, reservations, users]);

  const showToast = (msg, tone = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  };

  const isStallTaken = (stallId, date, slot) =>
    reservations.some((r) => r.stallId === stallId && r.date === date && r.slot === slot);

  const lotStalls = (lotId) => stalls.filter((s) => s.lotId === lotId);

  const lotAvailability = (lotId, date, slot) => {
    const all = lotStalls(lotId);
    const taken = all.filter((s) => isStallTaken(s.id, date, slot)).length;
    return { total: all.length, available: all.length - taken };
  };

  const totalAvailableNow = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    return lots.reduce((sum, l) => sum + lotAvailability(l.id, now, TIME_SLOTS[0]).available, 0);
  }, [lots, reservations]);

  const register = ({ name, id, email, password, plate, role }) => {
    if (!name || !id || !email || !password) {
      showToast("Fill in all required fields", "warn");
      return false;
    }
    if (users.some((u) => u.idNum === id)) {
      showToast("An account with that ID already exists", "bad");
      return false;
    }
    const newUser = {
      name,
      idNum: id,
      email,
      password,
      role,
      vehicles: plate ? [{ id: `veh-${Date.now()}`, plate }] : [],
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    showToast(`Welcome, ${newUser.name}`, "ok");
    return true;
  };

  const login = ({ id, password }) => {
    const found = users.find((u) => u.idNum === id && u.password === password);
    if (!found) {
      showToast("No matching account — check your ID/password or register", "bad");
      return false;
    }
    setUser(found);
    return true;
  };

  const logout = () => setUser(null);

  const addVehicle = (plate) => {
    if (!user) return;
    const updated = { ...user, vehicles: [...user.vehicles, { id: `veh-${Date.now()}`, plate }] };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.idNum === user.idNum ? updated : u)));
    showToast("Vehicle added", "ok");
  };

  const reserveStall = ({ stallId, lotId, date, slot, vehiclePlate }) => {
    if (isStallTaken(stallId, date, slot)) {
      showToast("That stall was just taken — pick another", "bad");
      return false;
    }
    const newRes = {
      id: `res-${Date.now()}`,
      stallId,
      lotId,
      date,
      slot,
      user: user.name,
      vehiclePlate,
    };
    setReservations((prev) => [...prev, newRes]);
    showToast("Spot reserved. See you there.", "ok");
    return true;
  };

  const cancelReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    showToast("Reservation cancelled", "ok");
  };

  const addLot = (name, zone, rows, cols) => {
    const id = `lot${lots.length + 1}-${Date.now()}`;
    setLots((prev) => [...prev, { id, name, zone, rows: Number(rows), cols: Number(cols) }]);
    showToast("Lot added", "ok");
  };

  const myReservations = useMemo(
    () => reservations.filter((r) => r.user === user?.name),
    [reservations, user]
  );

  const value = {
    lots,
    stalls,
    reservations,
    users,
    user,
    toast,
    showToast,
    isStallTaken,
    lotStalls,
    lotAvailability,
    totalAvailableNow,
    register,
    login,
    logout,
    addVehicle,
    reserveStall,
    cancelReservation,
    addLot,
    myReservations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
