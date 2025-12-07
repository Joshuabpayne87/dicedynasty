"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DiceRoller from "@/components/dice/DiceRoller";
import PlayerCard from "@/components/player/PlayerCard";
import { DRAFT_CONFIG, getPickTier } from "@/lib/game/draft";
import { Rarity, Player } from "@/lib/types";
import { getAvailablePlayers, saveDraftPick } from "@/app/actions/game";

export default function DraftRoom() {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentRound, setCurrentRound] = useState(1);
    const [currentPick, setCurrentPick] = useState(1);
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [tier, setTier] = useState<Rarity | null>(null);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [roster, setRoster] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) {
            router.push("/login");
            return;
        }
        getAvailablePlayers().then(setAvailablePlayers);
    }, [session, router]);

    const isGuaranteedRound = !!DRAFT_CONFIG.GUARANTEED_PICKS[currentRound];
    const draftComplete = currentRound > DRAFT_CONFIG.TOTAL_ROUNDS;

    const handleRollComplete = (rolls: number[]) => {
        const maxRoll = Math.max(...rolls);
        setRollResult(maxRoll);
        setTier(getPickTier(currentRound, maxRoll));
    };

    const handlePlayerSelect = async (player: Player) => {
        if (!session?.user?.id || loading) return;

        setLoading(true);
        try {
            // Save to DB
            await saveDraftPick(session.user.id, player.id, currentRound, currentPick);

            // Update local roster
            setRoster(prev => [...prev, player]);

            // Advance draft
            setRollResult(null);
            setTier(null);

            if (currentRound < DRAFT_CONFIG.TOTAL_ROUNDS) {
                setCurrentRound(prev => prev + 1);
                setCurrentPick(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to save draft pick:", error);
            alert("Failed to save draft pick. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (draftComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
                <h1 className="text-4xl font-bold text-dynasty-gold"> Draft Complete!</h1>
                <p className="text-xl text-gray-300">You've built your roster with {roster.length} players</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-3 bg-dynasty-gold text-dynasty-dark font-bold rounded hover:bg-yellow-400 transition"
                >
                    Continue to Dashboard
                </button>
            </div>
        );
    }

    const currentTier = isGuaranteedRound ? DRAFT_CONFIG.GUARANTEED_PICKS[currentRound] : tier;

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
            {/* Header */}
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
                            {rollResult && (
                                <div className="mt-4 text-center">
                                    <p className="text-lg text-gray-400">You rolled: <span className="text-dynasty-gold font-bold">{rollResult}</span></p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentTier && (
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
                                    .slice(0, 9)
                                    .map((player) => (
                                        <PlayerCard
                                            key={player.id}
                                            name={player.name}
                                            team={player.team}
                                            position={player.position}
                                            rarity={player.rarity}
                                            stats={player.stats}
                                            onClick={() => handlePlayerSelect(player)}
                                            selectable={true}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Roster */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-bold text-dynasty-gold mb-4">Your Roster ({roster.length}/15)</h3>
                        <div className="space-y-2">
                            {roster.map((player, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-slate-700/50 rounded">
                                    <span className="text-gray-400">{idx + 1}.</span>
                                    <span className="flex-1 truncate">{player.name}</span>
                                    <span className="text-xs text-gray-500">{player.position}</span>
                                </div>
                            ))}
                            {Array.from({ length: DRAFT_CONFIG.TOTAL_ROUNDS - roster.length }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="flex justify-between text-sm p-2 bg-slate-700/30 rounded">
                                    <span className="text-gray-600">{roster.length + idx + 1}. Empty</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
