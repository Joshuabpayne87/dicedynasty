"use client";

import { useState, useEffect } from "react";
import DiceRoller from "@/components/dice/DiceRoller";
import { DRAFT_CONFIG, getPickTier } from "@/lib/game/draft";
import { Rarity, Player } from "@/lib/types";
import { getAvailablePlayers, saveDraftPick } from "@/app/actions/game";

export default function DraftRoom() {
    const [currentRound, setCurrentRound] = useState(1);
    const [currentPick, setCurrentPick] = useState(1);
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [tier, setTier] = useState<Rarity | null>(null);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [roster, setRoster] = useState<Record<string, string | null>>({
        QB: null,
        RB: null,
        WR: null,
        TE: null,
        FLEX: null,
        K: null,
        DEF: null
    });

    useEffect(() => {
        getAvailablePlayers().then(setAvailablePlayers);
    }, []);

    const isGuaranteedRound = !!DRAFT_CONFIG.GUARANTEED_PICKS[currentRound];

    const handleRollComplete = (rolls: number[]) => {
        const maxRoll = Math.max(...rolls);
        setRollResult(maxRoll);
        setTier(getPickTier(currentRound, maxRoll));
    };

    const handlePlayerSelect = async (player: Player) => {
        // Optimistic update
        setRoster(prev => ({
            ...prev,
            [player.position]: player.name
        }));

        // Save to DB
        await saveDraftPick("user-1", player.id, currentRound, currentPick);

        // Advance draft
        setRollResult(null);
        setTier(null);
        if (currentRound < DRAFT_CONFIG.TOTAL_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            setCurrentPick(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-dynasty-gold/20">
                <div>
                    <h2 className="text-2xl font-bold text-dynasty-gold">Draft Room</h2>
                    <p className="text-gray-400">Round {currentRound} / {DRAFT_CONFIG.TOTAL_ROUNDS} • Pick {currentPick}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">Current Tier Availability</div>
                    <div className="text-xl font-bold text-white">
                        {isGuaranteedRound
                            ? `GUARANTEED ${DRAFT_CONFIG.GUARANTEED_PICKS[currentRound]}`
                            : tier || "ROLL TO REVEAL"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Draft Board */}
                <div className="lg:col-span-2 space-y-6">
                    {!isGuaranteedRound && !tier && (
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-4 text-center">Roll for Draft Position</h3>
                            <DiceRoller onRollCompleteAction={handleRollComplete} />
                        </div>
                    )}

                    {(tier || isGuaranteedRound) && (
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-4">
                                Select {isGuaranteedRound ? DRAFT_CONFIG.GUARANTEED_PICKS[currentRound] : tier} Player
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {availablePlayers
                                    .filter(p => isGuaranteedRound
                                        ? p.rarity === DRAFT_CONFIG.GUARANTEED_PICKS[currentRound]
                                        : p.rarity === tier
                                    )
                                    .slice(0, 6) // Limit display for now
                                    .map((player) => (
                                        <div
                                            key={player.id}
                                            onClick={() => handlePlayerSelect(player)}
                                            className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-dynasty-gold cursor-pointer transition"
                                        >
                                            <div className="w-12 h-12 bg-slate-700 rounded-full mb-2 mx-auto flex items-center justify-center text-xs">
                                                {player.team}
                                            </div>
                                            <div className="text-center font-bold truncate">{player.name}</div>
                                            <div className="text-center text-xs text-gray-400">{player.position} • {player.rarity}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Roster & History */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-bold text-dynasty-gold mb-4">Your Roster</h3>
                        <div className="space-y-2">
                            {Object.entries(roster).map(([pos, player]) => (
                                <div key={pos} className="flex justify-between text-sm p-2 bg-slate-700/50 rounded">
                                    <span>{pos}</span>
                                    <span className={player ? "text-white" : "text-gray-400"}>
                                        {player || "Empty"}
                                    </span>
                                </div>
                            ))}
                            {/* More slots... */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
