import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DraftRoom from "@/components/draft/DraftRoom";

export default async function DraftPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-dynasty-dark text-white">
            <DraftRoom />
        </main>
    );
}
