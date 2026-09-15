import React from "react";
import { Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useApp();
    return (
        <button onClick={toggleTheme} className="p-2 rounded border border-[var(--border-c)] text-[var(--text-secondart)]">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}