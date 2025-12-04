import { Rarity } from "@/lib/types";

export interface DraftState {
    currentRound: number;
    currentPick: number;
    totalRounds: number;
    picks: DraftPick[];
    availablePlayers: string[]; // Player IDs
}

export interface DraftPick {
    round: number;
    pickNumber: number;
    userId: string;
    playerId?: string;
    rollResult?: number;
    tier?: Rarity;
}

export const DRAFT_CONFIG = {
    TOTAL_ROUNDS: 15,
    GUARANTEED_PICKS: {
        1: Rarity.ELITE, // Round 1
        3: Rarity.RARE,  // Round 3
    } as Record<number, Rarity>,
};

export function initializeDraft(userIds: string[]): DraftState {
    const picks: DraftPick[] = [];

    for (let round = 1; round <= DRAFT_CONFIG.TOTAL_ROUNDS; round++) {
        // Snake draft order
        const roundOrder = round % 2 === 1 ? [...userIds] : [...userIds].reverse();

        roundOrder.forEach((userId, index) => {
            picks.push({
                round,
                pickNumber: (round - 1) * userIds.length + index + 1,
                userId,
            });
        });
    }

    return {
        currentRound: 1,
        currentPick: 1,
        totalRounds: DRAFT_CONFIG.TOTAL_ROUNDS,
        picks,
        availablePlayers: [], // Would be populated with all player IDs
    };
}

export function getPickTier(round: number, rollResult?: number): Rarity {
    // Check for guaranteed tiers first
    if (DRAFT_CONFIG.GUARANTEED_PICKS[round]) {
        return DRAFT_CONFIG.GUARANTEED_PICKS[round];
    }

    // Otherwise use roll result
    if (!rollResult) return Rarity.COMMON; // Default fallback

    if (rollResult > 90) return Rarity.LEGENDARY;
    if (rollResult > 75) return Rarity.ELITE;
    if (rollResult > 50) return Rarity.RARE;
    return Rarity.COMMON;
}
