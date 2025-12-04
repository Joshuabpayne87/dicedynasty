import { prisma } from "@/lib/db/client";
import { Position } from "@prisma/client";

export const ROSTER_LIMITS = {
    MIN_PLAYERS: 10,
    MAX_PLAYERS: 20,
    WARNING_THRESHOLD: 12,
};

export async function addToRoster(userId: string, playerId: string) {
    const roster = await prisma.roster.findUnique({
        where: { userId },
        include: { players: true }
    });

    if (!roster) throw new Error("Roster not found");

    if (roster.players.length >= ROSTER_LIMITS.MAX_PLAYERS) {
        throw new Error("Roster full");
    }

    // Add player with default 10 week contract
    await prisma.rosterPlayer.create({
        data: {
            rosterId: roster.id,
            playerId,
            contractWeeks: 10
        }
    });

    await updateTeamValue(roster.id);
}

export async function removeFromRoster(userId: string, playerId: string) {
    const roster = await prisma.roster.findUnique({
        where: { userId },
        include: { players: true }
    });

    if (!roster) throw new Error("Roster not found");

    if (roster.players.length <= ROSTER_LIMITS.MIN_PLAYERS) {
        throw new Error("Cannot release player: Roster below minimum size");
    }

    await prisma.rosterPlayer.delete({
        where: {
            rosterId_playerId: {
                rosterId: roster.id,
                playerId
            }
        }
    });

    await updateTeamValue(roster.id);
}

async function updateTeamValue(rosterId: string) {
    const roster = await prisma.roster.findUnique({
        where: { id: rosterId },
        include: {
            players: {
                include: { player: true }
            }
        }
    });

    if (!roster) return;

    const totalValue = roster.players.reduce((sum, rp) => sum + rp.player.baseValue, 0);

    await prisma.roster.update({
        where: { id: rosterId },
        data: { totalValue }
    });
}

export async function validateBattleLineup(userId: string, playerIds: string[]) {
    if (playerIds.length !== 3) throw new Error("Must select exactly 3 players");

    const roster = await prisma.roster.findUnique({
        where: { userId },
        include: {
            players: {
                include: { player: true }
            }
        }
    });

    if (!roster) throw new Error("Roster not found");

    const selectedPlayers = roster.players.filter(rp => playerIds.includes(rp.playerId));

    if (selectedPlayers.length !== 3) throw new Error("Invalid players selected");

    // Check for injuries/byes
    const unavailable = selectedPlayers.find(rp => rp.player.isInjured || rp.player.isOnBye);
    if (unavailable) {
        throw new Error(`Player ${unavailable.player.name} is unavailable`);
    }

    // Check position requirements (at least 1 QB, RB, WR across roster for battle eligibility?)
    // For specific lineup, maybe we want diversity? 
    // PRD says: "Defensive formation must have 3 different positions"

    const positions = new Set(selectedPlayers.map(rp => rp.player.position));
    if (positions.size < 3) {
        throw new Error("Defensive formation must have 3 different positions");
    }

    return true;
}
