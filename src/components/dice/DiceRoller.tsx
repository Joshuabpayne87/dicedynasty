"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface DiceProps {
    position: [number, number, number];
    value: number;
    isRolling: boolean;
    onRollComplete: () => void;
}

function Dice({ position, value, isRolling, onRollComplete }: DiceProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    // Target rotations for each face (1-6)
    // Note: This is a simplified mapping, real implementation would need precise Euler angles
    const faceRotations: Record<number, [number, number, number]> = {
        1: [0, 0, 0],
        2: [0, -Math.PI / 2, 0],
        3: [Math.PI / 2, 0, 0],
        4: [-Math.PI / 2, 0, 0],
        5: [0, Math.PI / 2, 0],
        6: [Math.PI, 0, 0],
    };

    useFrame((state, delta) => {
        if (meshRef.current) {
            if (isRolling) {
                // Random rotation while rolling
                meshRef.current.rotation.x += delta * 10;
                meshRef.current.rotation.y += delta * 12;
                meshRef.current.rotation.z += delta * 8;
            } else {
                // Smoothly rotate to target face
                // In a real physics engine we'd let it settle, here we animate to result
                // This is a placeholder for the actual physics simulation
            }
        }
    });

    return (
        <Box ref={meshRef} position={position} args={[1, 1, 1]}>
            <meshStandardMaterial color="#FFD700" />
            {/* Faces would be textures or text components in a full implementation */}
        </Box>
    );
}

export default function DiceRoller({
    onRollCompleteAction
}: {
    onRollCompleteAction: (rolls: number[]) => void
}) {
    const [isRolling, setIsRolling] = useState(false);
    const [rolls, setRolls] = useState<number[]>([1, 1, 1]);

    const handleRoll = async () => {
        setIsRolling(true);
        try {
            const { rollDiceAction } = await import("../../app/actions/game");
            const newRolls = await rollDiceAction(3);

            // Keep the animation delay for UX
            setTimeout(() => {
                setRolls(newRolls);
                setIsRolling(false);
                onRollCompleteAction(newRolls);
            }, 1500);
        } catch (error) {
            console.error("Failed to roll dice:", error);
            setIsRolling(false);
        }
    };

    return (
        <div className="w-full h-64 relative bg-slate-900 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Dice position={[-1.5, 0, 0]} value={rolls[0]} isRolling={isRolling} onRollComplete={() => { }} />
                <Dice position={[0, 0, 0]} value={rolls[1]} isRolling={isRolling} onRollComplete={() => { }} />
                <Dice position={[1.5, 0, 0]} value={rolls[2]} isRolling={isRolling} onRollComplete={() => { }} />
                <OrbitControls enableZoom={false} />
            </Canvas>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                    onClick={handleRoll}
                    disabled={isRolling}
                    className="px-6 py-2 bg-dynasty-gold text-dynasty-dark font-bold rounded disabled:opacity-50"
                >
                    {isRolling ? "Rolling..." : "Roll Dice"}
                </button>
            </div>

            {!isRolling && (
                <div className="absolute top-4 left-0 right-0 text-center text-white font-mono">
                    Result: {Math.max(...rolls)} ({rolls.join(", ")})
                </div>
            )}
        </div>
    );
}
