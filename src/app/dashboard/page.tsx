import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/client";

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            roster: {
                include: {
                    players: {
                        include: { player: true },
                    },
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const hasRoster = user.roster && user.roster.players.length > 0;

    return (
        <main className="min-h-screen bg-dynasty-dark text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-slate-800 p-6 rounded-lg border border-dynasty-gold/20">
                    <h1 className="text-3xl font-bold text-dynasty-gold mb-2">
                        {user.teamName}
                    </h1>
                    <p className="text-gray-400">@{user.username}</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="text-sm text-gray-400">Dynasty Tier</div>
                        <div className="text-2xl font-bold text-dynasty-gold">{user.dynastyTier}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="text-sm text-gray-400">Dynasty Points</div>
                        <div className="text-2xl font-bold">{user.dynastyPoints}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="text-sm text-gray-400">Record</div>
                        <div className="text-2xl font-bold">{user.wins}W - {user.losses}L</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="text-sm text-gray-400">Roster Size</div>
                        <div className="text-2xl font-bold">{user.roster?.players.length || 0}/15</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {!hasRoster ? (
                            <Link
                                href="/draft"
                                className="bg-dynasty-gold text-dynasty-dark font-bold p-4 rounded-lg hover:bg-yellow-400 transition text-center"
                            >
                                🎲 Start Draft
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/roster"
                                    className="bg-slate-700 font-bold p-4 rounded-lg hover:bg-slate-600 transition text-center border border-slate-600"
                                >
                                    👥 View Roster
                                </Link>
                                <Link
                                    href="/battle"
                                    className="bg-dynasty-gold text-dynasty-dark font-bold p-4 rounded-lg hover:bg-yellow-400 transition text-center"
                                >
                                    ⚔️ Find Battle
                                </Link>
                                <Link
                                    href="/leaderboard"
                                    className="bg-slate-700 font-bold p-4 rounded-lg hover:bg-slate-600 transition text-center border border-slate-600"
                                >
                                    🏆 Leaderboard
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Recent Activity placeholder */}
                {hasRoster && (
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                        <p className="text-gray-400">No recent battles</p>
                    </div>
                )}
            </div>
        </main>
    );
}
