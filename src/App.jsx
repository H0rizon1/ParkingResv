import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reserve from "./pages/Reserve.jsx";
import MyReservations from "./pages/MyReservations.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";

// Wraps any route that requires a logged-in user; bounces to landing otherwise.
function RequireAuth({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-[#1F2226]">
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/reserve" element={<RequireAuth><Reserve /></RequireAuth>} />
        <Route path="/my-reservations" element={<RequireAuth><MyReservations /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
