// src/app/game/page.tsx
import type { Metadata } from "next";
import { canonicalMetadata } from "@/lib/site-url";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { TicTacToeGame } from "@/components/game/TicTacToeGame";

export const metadata: Metadata = {
  ...canonicalMetadata("/game"),
  title: "Tic-Tac-Toe",
  description:
    "Play Tic-Tac-Toe against an unbeatable Minimax AI or a friend on the SDP Portal.",
};

export default function GamePage() {
  return (
    <>
      <BackgroundPattern
        variant="dark"
        className="border-b border-[#102A43]/30"
      >
        <section className="mx-auto max-w-6xl px-6 py-10 text-center sm:py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tic-Tac-Toe <span className="text-[#60A5FA]">Arena</span>
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Challenge the Minimax AI or pass and play with a friend.
          </p>
        </section>
      </BackgroundPattern>

      <BackgroundPattern variant="light">
        <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <TicTacToeGame />
        </section>
      </BackgroundPattern>
    </>
  );
}
