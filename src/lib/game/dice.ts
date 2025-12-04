export interface DiceRollResult {
    rolls: number[];
    total: number;
    modifiers: number;
    finalTotal: number;
    isCrit: boolean; // Roll of 100
    isFumble: boolean; // Roll of 1
}

export function rollDice(count: number = 1, sides: number = 100, modifiers: number = 0): DiceRollResult {
    const rolls: number[] = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        // Use the random value to get a number between 1 and sides
        const roll = (array[0] % sides) + 1;
        rolls.push(roll);
        total += roll;
    }

    const finalTotal = total + modifiers;

    return {
        rolls,
        total,
        modifiers,
        finalTotal,
        isCrit: rolls.some(r => r === sides),
        isFumble: rolls.some(r => r === 1)
    };
}

export function rollForDraft(): { rolls: number[], kept: number, tier: "COMMON" | "RARE" | "ELITE" | "LEGENDARY" } {
    const rolls = [];
    for (let i = 0; i < 3; i++) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        rolls.push((array[0] % 100) + 1);
    }

    const kept = Math.max(...rolls);

    let tier: "COMMON" | "RARE" | "ELITE" | "LEGENDARY" = "COMMON";
    if (kept > 90) tier = "LEGENDARY";
    else if (kept > 75) tier = "ELITE";
    else if (kept > 50) tier = "RARE";

    return { rolls, kept, tier };
}
