"use client";

import { Rarity } from "@/lib/types";

interface PlayerCardProps {
    name: string;
    team: string;
    position: string;
    rarity: Rarity;
    stats?: Record<string, any>;
    onClick?: () => void;
    selectable?: boolean;
}

const rarityStyles = {
    [Rarity.LEGENDARY]: {
        border: "border-2 border-yellow-400",
        bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20",
        text: "text-yellow-400",
        badge: "rarity-legendary",
        glow: "animate-glow-legendary",
    },
    [Rarity.ELITE]: {
        border: "border-2 border-purple-400",
        bg: "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
        text: "text-purple-400",
        badge: "rarity-elite",
        glow: "animate-glow-elite",
    },
    [Rarity.RARE]: {
        border: "border-2 border-blue-400",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        badge: "bg-blue-500",
        glow: "",
    },
    [Rarity.COMMON]: {
        border: "border border-slate-600",
        bg: "bg-slate-800/50",
        text: "text-slate-400",
        badge: "bg-slate-600",
        glow: "",
    },
};

export default function PlayerCard({
    name,
    team,
    position,
    rarity,
    stats,
    onClick,
    selectable = false,
}: PlayerCardProps) {
    const style = rarityStyles[rarity];

    return (
        <div
            onClick={onClick}
            className={`
                relative p-4 rounded-lg transition-all duration-200
                ${style.border} ${style.bg} ${style.glow}
                ${selectable ? "cursor-pointer hover:scale-105 hover:shadow-xl" : ""}
            `}
        >
            {/* Rarity Badge */}
            <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-bold rounded ${style.badge} text-white`}>
                    {rarity}
                </span>
            </div>

            {/* Team Logo Placeholder */}
            <div className="w-16 h-16 bg-slate-700 rounded-full mb-3 mx-auto flex items-center justify-center font-bold text-white text-sm">
                {team}
            </div>

            {/* Player Name */}
            <div className="text-center font-bold text-white truncate mb-1">
                {name}
            </div>

            {/* Position */}
            <div className={`text-center text-sm font-semibold ${style.text}`}>
                {position}
            </div>

            {/* Stats */}
            {stats && (
                <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                    {Object.entries(stats).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-white font-semibold">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
