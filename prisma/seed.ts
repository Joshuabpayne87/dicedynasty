import { PrismaClient, Rarity, Position, Trend } from '@prisma/client';

const prisma = new PrismaClient();

const PLAYERS = [
    // QBs
    {
        nflId: 'p_mahomes',
        name: 'Patrick Mahomes',
        position: Position.QB,
        team: 'KC',
        rarity: Rarity.LEGENDARY,
        baseValue: 100,
        stats: { passingYards: 4183, touchdowns: 27, interceptions: 14 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'j_allen',
        name: 'Josh Allen',
        position: Position.QB,
        team: 'BUF',
        rarity: Rarity.ELITE,
        baseValue: 95,
        stats: { passingYards: 4306, touchdowns: 29, interceptions: 18 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 'l_jackson',
        name: 'Lamar Jackson',
        position: Position.QB,
        team: 'BAL',
        rarity: Rarity.ELITE,
        baseValue: 94,
        stats: { passingYards: 3678, touchdowns: 24, interceptions: 7 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'j_hurts',
        name: 'Jalen Hurts',
        position: Position.QB,
        team: 'PHI',
        rarity: Rarity.RARE,
        baseValue: 88,
        stats: { passingYards: 3858, touchdowns: 23, interceptions: 15 },
        trendStatus: Trend.COLD
    },
    {
        nflId: 'c_stroud',
        name: 'C.J. Stroud',
        position: Position.QB,
        team: 'HOU',
        rarity: Rarity.RARE,
        baseValue: 85,
        stats: { passingYards: 4108, touchdowns: 23, interceptions: 5 },
        trendStatus: Trend.NEUTRAL
    },

    // RBs
    {
        nflId: 'c_mccaffrey',
        name: 'Christian McCaffrey',
        position: Position.RB,
        team: 'SF',
        rarity: Rarity.LEGENDARY,
        baseValue: 98,
        stats: { rushingYards: 1459, touchdowns: 14, receivingYards: 564 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'b_hall',
        name: 'Breece Hall',
        position: Position.RB,
        team: 'NYJ',
        rarity: Rarity.ELITE,
        baseValue: 92,
        stats: { rushingYards: 994, touchdowns: 5, receivingYards: 591 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 'k_williams',
        name: 'Kyren Williams',
        position: Position.RB,
        team: 'LAR',
        rarity: Rarity.RARE,
        baseValue: 89,
        stats: { rushingYards: 1144, touchdowns: 12, receivingYards: 206 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'j_gibbs',
        name: 'Jahmyr Gibbs',
        position: Position.RB,
        team: 'DET',
        rarity: Rarity.RARE,
        baseValue: 88,
        stats: { rushingYards: 945, touchdowns: 10, receivingYards: 316 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 't_etienne',
        name: 'Travis Etienne Jr.',
        position: Position.RB,
        team: 'JAX',
        rarity: Rarity.COMMON,
        baseValue: 82,
        stats: { rushingYards: 1008, touchdowns: 11, receivingYards: 476 },
        trendStatus: Trend.COLD
    },

    // WRs
    {
        nflId: 'j_jefferson',
        name: 'Justin Jefferson',
        position: Position.WR,
        team: 'MIN',
        rarity: Rarity.LEGENDARY,
        baseValue: 99,
        stats: { receivingYards: 1074, touchdowns: 5, receptions: 68 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 't_hill',
        name: 'Tyreek Hill',
        position: Position.WR,
        team: 'MIA',
        rarity: Rarity.LEGENDARY,
        baseValue: 97,
        stats: { receivingYards: 1799, touchdowns: 13, receptions: 119 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'c_lamb',
        name: 'CeeDee Lamb',
        position: Position.WR,
        team: 'DAL',
        rarity: Rarity.ELITE,
        baseValue: 96,
        stats: { receivingYards: 1749, touchdowns: 12, receptions: 135 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'a_st_brown',
        name: 'Amon-Ra St. Brown',
        position: Position.WR,
        team: 'DET',
        rarity: Rarity.ELITE,
        baseValue: 93,
        stats: { receivingYards: 1515, touchdowns: 10, receptions: 119 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 'p_nacua',
        name: 'Puka Nacua',
        position: Position.WR,
        team: 'LAR',
        rarity: Rarity.RARE,
        baseValue: 88,
        stats: { receivingYards: 1486, touchdowns: 6, receptions: 105 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'g_wilson',
        name: 'Garrett Wilson',
        position: Position.WR,
        team: 'NYJ',
        rarity: Rarity.RARE,
        baseValue: 86,
        stats: { receivingYards: 1042, touchdowns: 3, receptions: 95 },
        trendStatus: Trend.COLD
    },

    // TEs
    {
        nflId: 's_laporta',
        name: 'Sam LaPorta',
        position: Position.TE,
        team: 'DET',
        rarity: Rarity.ELITE,
        baseValue: 91,
        stats: { receivingYards: 889, touchdowns: 10, receptions: 86 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 't_kelce',
        name: 'Travis Kelce',
        position: Position.TE,
        team: 'KC',
        rarity: Rarity.ELITE,
        baseValue: 90,
        stats: { receivingYards: 984, touchdowns: 5, receptions: 93 },
        trendStatus: Trend.COLD
    },
    {
        nflId: 't_mcbride',
        name: 'Trey McBride',
        position: Position.TE,
        team: 'ARI',
        rarity: Rarity.RARE,
        baseValue: 85,
        stats: { receivingYards: 825, touchdowns: 3, receptions: 81 },
        trendStatus: Trend.HOT
    },

    // K
    {
        nflId: 'j_tucker',
        name: 'Justin Tucker',
        position: Position.K,
        team: 'BAL',
        rarity: Rarity.ELITE,
        baseValue: 90,
        stats: { fieldGoalsMade: 32, fieldGoalsAttempted: 37 },
        trendStatus: Trend.NEUTRAL
    },
    {
        nflId: 'b_aubrey',
        name: 'Brandon Aubrey',
        position: Position.K,
        team: 'DAL',
        rarity: Rarity.RARE,
        baseValue: 88,
        stats: { fieldGoalsMade: 36, fieldGoalsAttempted: 38 },
        trendStatus: Trend.HOT
    },

    // DEF
    {
        nflId: 'def_cle',
        name: 'Cleveland Browns',
        position: Position.DEF,
        team: 'CLE',
        rarity: Rarity.ELITE,
        baseValue: 92,
        stats: { sacks: 49, interceptions: 18, pointsAllowed: 362 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'def_bal',
        name: 'Baltimore Ravens',
        position: Position.DEF,
        team: 'BAL',
        rarity: Rarity.ELITE,
        baseValue: 94,
        stats: { sacks: 60, interceptions: 18, pointsAllowed: 280 },
        trendStatus: Trend.HOT
    },
    {
        nflId: 'def_sf',
        name: 'San Francisco 49ers',
        position: Position.DEF,
        team: 'SF',
        rarity: Rarity.RARE,
        baseValue: 89,
        stats: { sacks: 48, interceptions: 22, pointsAllowed: 298 },
        trendStatus: Trend.NEUTRAL
    }
];

async function main() {
    console.log('Start seeding ...');

    // Optional: Clean up existing players
    // await prisma.player.deleteMany();

    for (const player of PLAYERS) {
        const p = await prisma.player.upsert({
            where: { nflId: player.nflId },
            update: {},
            create: player,
        });
        console.log(`Created player with id: ${p.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
