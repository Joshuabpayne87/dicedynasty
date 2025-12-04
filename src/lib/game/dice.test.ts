import { rollDice, rollForDraft } from "@/lib/game/dice";

describe("Dice Logic", () => {
    test("rollDice returns correct structure", () => {
        const result = rollDice(3, 100, 0);
        expect(result.rolls).toHaveLength(3);
        expect(result.total).toBeGreaterThanOrEqual(3);
        expect(result.total).toBeLessThanOrEqual(300);
        expect(result.finalTotal).toBe(result.total);
    });

    test("rollDice handles modifiers", () => {
        const result = rollDice(1, 100, 10);
        expect(result.finalTotal).toBe(result.total + 10);
    });

    test("rollForDraft returns valid tier", () => {
        const result = rollForDraft();
        expect(["COMMON", "RARE", "ELITE", "LEGENDARY"]).toContain(result.tier);
        expect(result.rolls).toHaveLength(3);
    });
});
