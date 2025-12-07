import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, username, password, teamName } = await req.json();

        // Validate input
        if (!email || !username || !password || !teamName) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email or username already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with roster
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                teamName,
                roster: {
                    create: {}, // Create empty roster
                },
            },
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
