import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/client";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                // WARNING: In production, use bcrypt to compare hashed passwords
                const isValid = credentials.password === user.password;

                if (!isValid) return null;

                return { id: user.id, name: user.username, email: user.email };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session: ({ session, token }) => {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
