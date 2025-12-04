"use server";

import { rollDice } from "@/lib/game/dice";

export async function rollDiceAction(count: number = 3) {
    // In a real app, we would verify the user's session here
    // and check if they have valid re-roll tokens if applicable

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = rollDice(count);
    return result.rolls;
}

import { PrismaClient } from "@prisma/client";
import { Player, Position, Rarity } from "@/lib/types";

const prisma = new PrismaClient();

export async function getAvailablePlayers(): Promise<Player[]> {
    const players = await prisma.player.findMany({
        orderBy: { baseValue: 'desc' }
    });

    // Cast to local type (assuming structure matches)
    return players as unknown as Player[];
}

export async function saveDraftPick(userId: string, playerId: string, round: number, pickNumber: number) {
    // 1. Get user's roster
    let roster = await prisma.roster.findUnique({
        where: { userId }
    });

    if (!roster) {
        roster = await prisma.roster.create({
            data: { userId }
        });
    }

    // 2. Add player to roster
    await prisma.rosterPlayer.create({
        data: {
            rosterId: roster.id,
            playerId,
            contractWeeks: 10 // Default
        }
    });

    // 3. Mark player as drafted (optional, if we want to hide them)
    // For now, we just return success
    return { success: true };
}
