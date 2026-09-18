import React from "react";
import StallIcon from "./StallIcon.jsx";

function row(ids, xStart, xEnd, y) {
    return ids.map((id, i) => ({
        id,
        x: xStart + (xEnd - xStart) * (ids.length === 1 ? 0.5 : i / (ids.length - 1)),
        y,
    }));
}

function col(ids, x, yStart, yEnd) {
    return ids.map((id, i) => ({
        id,
        x,
        y: yStart + (yEnd - yStart) * (ids.length === 1 ? 0.5 : i / (ids.length - 1)),
        o: "h",
    }));
}

const LAYOUT = [
    ...row(["S20", "S19", "S18", "S17", "S16", "S15", "S14", "S13", "S12", "S11", "S10", "S9", "S8", "S7", "S6", "S5", "S4", "S3", "S2", "S1"], 17, 79, 6),
    { id: "S21", x: 2, y: 14 },
    { id: "S22", x: 2, y: 20 },
    { id: "S23", x: 6, y: 27 },
    { id: "S24", x: 9, y: 27 },
    ...col(["F8", "F9", "E17", "E18", "E19", "E20", "F10", "F11"], 13, 35, 78),
    ...col(["F2", "F3", "F4", "E21", "F5", "F6", "F7"], 27, 38, 68),
    ...row(["F1","E16","E15","S25","S26","S27","S28","S29","S30","S31","E14"], 30, 65, 29),
    ...col(["E22","E23","E24","E25","E26","E27"], 67, 38, 68),
    { id: "PWD1", x: 30, y: 76 },
    { id: "PWD2", x: 54, y: 76 },
    { id: "E29", x: 58, y: 76 },
    { id: "E28", x: 61, y: 76 },
    ...row(["E9","E8","E7"], 76, 82, 34),
    ...col(["E10","E11","E12","E13","F12"], 76, 40, 67),
    ...col(["E6","E5","E4","E3"], 82, 43, 63),
    { id: "E2", x: 96, y: 47 },
    { id: "E1", x: 96, y: 55 },
];

export default function FloorPlan({ stalls, user, selectedStall, onSelect, isStallTaken, selectedDate, startIndex, endIndex, stallCategoryAllowed }) {
    const stallMap = Object.fromEntries(stalls.map((s) => [s.id, s]));

    return (
        <div className="relative w-full rounded-md border border-[var(--border-c)] bg-[var(--surface)]" style={{ aspectRatio: "2 / 1" }}>
            <div
                className="absolute rounded bg-[var(--bg)] border border-[var(--border-c)]"
                style={{ left: "29%", top: "34%", width: "37%", height: "36%" }}
            />
            <div className="absolute text-[10px] uppercase font-display text-[var(--text-muted)]" style={{ left: "85%", top: "2%" }}>
                Motorcycles
            </div>

        {LAYOUT.map(({ id, x, y, o }) => {
            const stall = stallMap[id];
            if (!stall) return null;
            const restricted = !stallCategoryAllowed(stall, user.role);
            const taken = !restricted && isStallTaken(stall.id, selectedDate, startIndex, endIndex);
            const status = restricted ? "restricted" : taken ? "reserved" : selectedStall === stall.id ? "selected" : "available";
            return (
                <button
                    key={id}
                    disabled={restricted || taken}
                    onClick={() => onSelect(stall.id)}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${x}%`, top: `${y}%`, width: "3.2%", transform: "translate(-50%, -50%)" }}
                    title={id}
                >
                    <StallIcon status={status} orientation={o} />
                </button>
            );
        })}
        </div>
    );
}