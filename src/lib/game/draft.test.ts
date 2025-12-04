import { initializeDraft, getPickTier, DRAFT_CONFIG } from "@/lib/game/draft";

describe("Draft Logic", () => {
    test("initializeDraft creates correct number of picks", () => {
        const userIds = ["user1", "user2"];
        const draft = initializeDraft(userIds);

        expect(draft.totalRounds).toBe(15);
        expect(draft.picks).toHaveLength(15 * 2);
        expect(draft.picks[0].userId).toBe("user1");
        expect(draft.picks[1].userId).toBe("user2");
        // Round 2 (snake)
        expect(draft.picks[2].userId).toBe("user2");
        expect(draft.picks[3].userId).toBe("user1");
    });

    test("getPickTier returns guaranteed tiers", () => {
        expect(getPickTier(1)).toBe("ELITE");
        expect(getPickTier(3)).toBe("RARE");
    });

    test("getPickTier returns correct tier based on roll", () => {
        expect(getPickTier(2, 95)).toBe("LEGENDARY");
        expect(getPickTier(2, 80)).toBe("ELITE");
        expect(getPickTier(2, 60)).toBe("RARE");
        expect(getPickTier(2, 40)).toBe("COMMON");
    });
});
