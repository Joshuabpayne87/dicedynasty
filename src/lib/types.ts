export enum Rarity {
    COMMON = "COMMON",
    RARE = "RARE",
    ELITE = "ELITE",
    LEGENDARY = "LEGENDARY"
}

export enum Position {
    QB = "QB",
    RB = "RB",
    WR = "WR",
    TE = "TE",
    DEF = "DEF",
    K = "K"
}

export interface Player {
    id: string;
    nflId: string;
    name: string;
    position: Position;
    team: string;
    rarity: Rarity;
    baseValue: number;
    stats: any; // Using any for simplicity, or define specific stats type
    trendStatus: string;
    isInjured: boolean;
    isOnBye: boolean;
}
