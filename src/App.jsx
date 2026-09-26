import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";
import Footer  from "./components/Footer.jsx";

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

function RequireNonAdmin({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (user.role != "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Navbar />
      <Toast />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<RequireNonAdmin><Dashboard /></RequireNonAdmin>} />
          <Route path="/reserve" element={<RequireNonAdmin><Reserve /></RequireNonAdmin>} />
          <Route path="/my-reservations" element={<RequireNonAdmin><MyReservations /></RequireNonAdmin>} />
          <Route path="/profile" element={<RequireNonAdmin><Profile /></RequireNonAdmin>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
