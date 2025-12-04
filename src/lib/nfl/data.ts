import { Position, Rarity } from "@prisma/client";

export interface MockPlayer {
    nflId: string;
    name: string;
    position: Position;
    team: string;
    rarity: Rarity;
    baseValue: number;
    stats: {
        passingYards?: number;
        passingTDs?: number;
        interceptions?: number;
        rushingYards?: number;
        rushingTDs?: number;
        receivingYards?: number;
        receivingTDs?: number;
        sacks?: number;
        fieldGoals?: number;
    };
}

export const MOCK_PLAYERS: MockPlayer[] = [
    {
        nflId: "1",
        name: "Patrick Mahomes",
        position: "QB",
        team: "KC",
        rarity: "LEGENDARY",
        baseValue: 1000,
        stats: { passingYards: 4183, passingTDs: 27, interceptions: 14, rushingYards: 389, rushingTDs: 0 }
    },
    {
        nflId: "2",
        name: "Christian McCaffrey",
        position: "RB",
        team: "SF",
        rarity: "LEGENDARY",
        baseValue: 980,
        stats: { rushingYards: 1459, rushingTDs: 14, receivingYards: 564, receivingTDs: 7 }
    },
    {
        nflId: "3",
        name: "Tyreek Hill",
        position: "WR",
        team: "MIA",
        rarity: "LEGENDARY",
        baseValue: 950,
        stats: { receivingYards: 1799, receivingTDs: 13, rushingYards: 15, rushingTDs: 0 }
    },
    {
        nflId: "4",
        name: "Lamar Jackson",
        position: "QB",
        team: "BAL",
        rarity: "ELITE",
        baseValue: 920,
        stats: { passingYards: 3678, passingTDs: 24, interceptions: 7, rushingYards: 821, rushingTDs: 5 }
    },
    {
        nflId: "5",
        name: "CeeDee Lamb",
        position: "WR",
        team: "DAL",
        rarity: "ELITE",
        baseValue: 910,
        stats: { receivingYards: 1749, receivingTDs: 12, rushingYards: 113, rushingTDs: 2 }
    },
    {
        nflId: "6",
        name: "Josh Allen",
        position: "QB",
        team: "BUF",
        rarity: "ELITE",
        baseValue: 900,
        stats: { passingYards: 4306, passingTDs: 29, interceptions: 18, rushingYards: 524, rushingTDs: 15 }
    },
    {
        nflId: "7",
        name: "Justin Jefferson",
        position: "WR",
        team: "MIN",
        rarity: "ELITE",
        baseValue: 890,
        stats: { receivingYards: 1074, receivingTDs: 5 }
    },
    {
        nflId: "8",
        name: "Travis Kelce",
        position: "TE",
        team: "KC",
        rarity: "ELITE",
        baseValue: 880,
        stats: { receivingYards: 984, receivingTDs: 5 }
    },
    {
        nflId: "9",
        name: "Micah Parsons",
        position: "DEF",
        team: "DAL",
        rarity: "ELITE",
        baseValue: 870,
        stats: { sacks: 14, interceptions: 0 }
    },
    {
        nflId: "10",
        name: "Justin Tucker",
        position: "K",
        team: "BAL",
        rarity: "ELITE",
        baseValue: 850,
        stats: { fieldGoals: 32 }
    }
];
