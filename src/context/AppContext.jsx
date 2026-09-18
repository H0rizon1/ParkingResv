import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { venueConfig } from "../config/venueConfig.js";

const AppContext = createContext(null);
const STORAGE_KEY = "campus-parking-data-v1";

const initialLots = [
  { id: "b1", name: "Basement 1 - Mapua Makati" },
];

function makeStalls(prefix, count, category) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    lotId: "b1",
    label: `${prefix}${i + 1}`,
    category,
  }));
}

const initialStalls = [
  ...makeStalls("S", 31, "student"),
  ...makeStalls("E", 29, "employee"),
  ...makeStalls("F", 12, "faculty"),
  ...makeStalls("PWD", 2, "pwd"),
];

export const TIME_BOUNDARIES = [
  "7:30 AM", "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM",
  "3:00 PM", "4:30 PM", "6:00 PM", "7:30 PM", "9:00 PM",
];

export function formatRange(startIndex, endIndex) {
  return `${TIME_BOUNDARIES[startIndex]} - ${TIME_BOUNDARIES[endIndex]}`;
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
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
  const [stalls] = useState(() => persisted?.stalls || initialStalls);
  const [reservations, setReservations] = useState(persisted?.reservations || []);
  const [users, setUsers] = useState(persisted?.users || []);
  const [user, setUser] = useState(null); // session not restored — log in each visit
  const [toast, setToast] = useState(null);


  // Persist to localStorage so data survives refresh / offline use —
  // no server or network connection required.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lots, stalls, reservations, users }));
    } catch {
      // storage unavailable — fail silently, app still works in-memory
    }
  }, [lots, reservations, users]);

  const [theme, setTheme] = useState(() => localStorage.getItem("campus-parking-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("campus-parking-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const showToast = (msg, tone = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  };

  const isStallTaken = (stallId, date, startIndex, endIndex) =>
    reservations.some(
      (r) => r.stallId === stallId && r.date === date &&
      rangesOverlap(startIndex, endIndex, r.startIndex, r.endIndex)
    );

  const ROLE_CATEGORY_MAP = { student: "student", faculty: "faculty", employee: "employee" };

  const stallCategoryAllowed = (stall, role) =>
    stall.category === "pwd" ? false : stall.category === ROLE_CATEGORY_MAP[role];

  const lotStalls = (lotId) => stalls.filter((s) => s.lotId === lotId);

  const lotAvailability = (lotId, date, startIndex, endIndex) => {
    const all = lotStalls(lotId);
    const taken = all.filter((s) => isStallTaken(s.id, date, startIndex, endIndex)).length;
    return { total: all.length, available: all.length - taken };
  };

  const categoryAvailability = (category, date, startIndex, endIndex) => {
    const all = stalls.filter((s) => s.category === category);
    const taken = all.filter((s) => isStallTaken(s.id, date, startIndex, endIndex)).length;
    return { total: all.length, available: category === "pwd" ? 0 : all.length - taken };
  }

  const totalAvailableNow = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    return lots.reduce((sum, l) => sum + lotAvailability(l.id, now, 0, 1).available, 0);
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
      return null;
    }
    setUser(found);
    return found;
  };

  const logout = () => setUser(null);

  const addVehicle = (plate) => {
    if (!user) return;
    const updated = { ...user, vehicles: [...user.vehicles, { id: `veh-${Date.now()}`, plate }] };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.idNum === user.idNum ? updated : u)));
    showToast("Vehicle added", "ok");
  };

  const removeVehicle = (vehiclePlate) => {
    if (!user) return;
    const updated = { ...user, vehicles: user.vehicles.filter((v) => v.id !== vehiclePlate) };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.idNum === user.idNum ? updated : u)));
    showToast("Vehicle removed", "ok");
  };

  const reserveStall = ({ stallId, lotId, date, startIndex, endIndex, vehiclePlate }) => {
    if (isStallTaken(stallId, date, startIndex, endIndex)) {
      showToast("That stall overlaps an existing booking — pick another time or stall", "bad");
      return false;
    }
    const newRes = {
      id: `res-${Date.now()}`,
      stallId,
      lotId,
      date,
      startIndex,
      endIndex,
      userId: user.idNum,
      username: user.name,
      vehiclePlate
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
    () => reservations.filter((r) => r.userId === user?.idNum),
    [reservations, user]
  );

  const value = {
    lots,
    stalls,
    reservations,
    users,
    user,
    toast,
    theme,
    toggleTheme,
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
    stallCategoryAllowed,
    categoryAvailability
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
