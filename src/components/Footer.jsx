import React from "react";

export default function Footer() {
    return (
        <footer className="px-6 py-4 mt-auto border-t border-[var(--border-c)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
                &copy; {new Date().getFullYear()} Sabio, Sulayao, Esguerra, Figueras | Mapua University Parking Proposal
            </p>
        </footer>
    );
}