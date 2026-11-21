// src/components/game/TicTacToeGame.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {Modal} from "@/components/ui/Modal";
import {
  createEmptyBoard,
  evaluateBoard,
  getBestAiMove,
  getOpponent,
  type BoardState,
  type Difficulty,
  type GameMode,
  type PlayerMark,
} from "@/lib/tictactoe-ai";
import { cn } from "@/lib/utils";

interface ScoreBoard {
  x: number;
  o: number;
  draws: number;
}

const DIFFICULTY_OPTIONS: ReadonlyArray<{ id: Difficulty; label: string }> = [
  { id: "casual", label: "Casual" },
  { id: "smart", label: "Smart" },
  { id: "unbeatable", label: "Unbeatable" },
];

function MarkIcon({
  mark,
  isWinning,
}: {
  mark: PlayerMark;
  isWinning: boolean;
}) {
  if (mark === "X") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        fill="none"
        className={cn(
          "h-11 w-11 sm:h-13 sm:w-13",
          isWinning ? "text-white" : "text-[#0B1F33]"
        )}
      >
        <line
          x1="10"
          y1="10"
          x2="38"
          y2="38"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
        <line
          x1="38"
          y1="10"
          x2="10"
          y2="38"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={cn(
        "h-11 w-11 sm:h-13 sm:w-13",
        isWinning ? "text-white" : "text-[#2563EB]"
      )}
    >
      <circle
        cx="24"
        cy="24"
        r="15"
        stroke="currentColor"
        strokeWidth="4.5"
      />
    </svg>
  );
}

export function TicTacToeGame() {
  const [mode, setMode] = useState<GameMode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("casual");
  const [humanMark, setHumanMark] = useState<PlayerMark>("X");
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard());
  const [currentTurn, setCurrentTurn] = useState<PlayerMark>("X");
  const [scores, setScores] = useState<ScoreBoard>({ x: 0, o: 0, draws: 0 });
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [showFailOverlay, setShowFailOverlay] = useState(false);

  const aiMark = getOpponent(humanMark);
  const result = useMemo(() => evaluateBoard(board), [board]);
  const isGameOver = result.winner !== null;
  const didHumanLose = mode === "ai" && result.winner === aiMark;
  const isAiTurn = mode === "ai" && !isGameOver && currentTurn === aiMark;

  const isAiThinking = isAiTurn;

  const commitMove = useCallback((index: number, mark: PlayerMark, snapshot: BoardState) => {
    const nextBoard = [...snapshot];
    nextBoard[index] = mark;

    const outcome = evaluateBoard(nextBoard);
    setBoard(nextBoard);
    setHintIndex(null);

    if (outcome.winner === "X") {
      setScores((prev) => ({ ...prev, x: prev.x + 1 }));
    } else if (outcome.winner === "O") {
      setScores((prev) => ({ ...prev, o: prev.o + 1 }));
    } else if (outcome.winner === "draw") {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentTurn(getOpponent(mark));
    }
  }, []);

  useEffect(() => {
    if (!isAiTurn) {
      return;
    }

    const timer = window.setTimeout(() => {
      const move = getBestAiMove(board, aiMark, difficulty);
      if (move !== null) {
        commitMove(move, aiMark, board);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isAiTurn, board, aiMark, difficulty, commitMove]);

  // Show full-screen Retry overlay shortly after the AI completes a winning line
  useEffect(() => {
    if (!didHumanLose) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowFailOverlay(true);
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [didHumanLose]);

  const handleCellClick = (index: number) => {
    if (isGameOver || isAiThinking || isAiTurn) return;
    if (board[index] !== null) return;

    commitMove(index, currentTurn, board);
  };

  const handleNewRound = () => {
    setBoard(createEmptyBoard());
    setCurrentTurn("X");
    setHintIndex(null);
    setShowFailOverlay(false);
  };

  const handleResetAll = () => {
    handleNewRound();
    setScores({ x: 0, o: 0, draws: 0 });
  };

  const handleModeChange = (nextMode: GameMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setBoard(createEmptyBoard());
    setCurrentTurn("X");
    setHintIndex(null);
    setShowFailOverlay(false);
    setScores({ x: 0, o: 0, draws: 0 });
  };

  const handleDifficultyChange = (nextDifficulty: Difficulty) => {
    if (nextDifficulty === difficulty) return;
    setDifficulty(nextDifficulty);
    handleNewRound();
  };

  const handleMarkChange = (nextMark: PlayerMark) => {
    if (nextMark === humanMark) return;
    setHumanMark(nextMark);
    setBoard(createEmptyBoard());
    setCurrentTurn("X");
    setHintIndex(null);
    setShowFailOverlay(false);
    setScores({ x: 0, o: 0, draws: 0 });
  };

  const handleShowHint = () => {
    if (isGameOver || isAiThinking || isAiTurn) return;
    const optimal = getBestAiMove(board, currentTurn, "unbeatable");
    setHintIndex(optimal);
  };

  const xLabel =
    mode === "ai" ? (humanMark === "X" ? "You (X)" : "AI (X)") : "Player X";
  const oLabel =
    mode === "ai" ? (humanMark === "O" ? "You (O)" : "AI (O)") : "Player O";

  let statusText = "";
  if (result.winner === "draw") {
    statusText = "Draw round";
  } else if (result.winner === "X" || result.winner === "O") {
    if (mode === "ai") {
      statusText = result.winner === humanMark ? "You win" : "AI wins";
    } else {
      statusText = `Player ${result.winner} wins`;
    }
  } else if (isAiThinking || isAiTurn) {
    statusText = "AI thinking...";
  } else if (mode === "ai") {
    statusText = `Your turn (${humanMark})`;
  } else {
    statusText = `Player ${currentTurn}'s turn`;
  }

  return (
    <>
      <div className="mx-auto max-w-lg space-y-5">
        {/* Compact Controls Strip */}
        <div className="space-y-3 rounded-[2px] border-[1.5px] border-[#102A43]/20 bg-white p-4 shadow-[0_2px_10px_rgba(16,42,67,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Mode Toggle */}
            <div className="inline-flex rounded-[2px] border border-[#102A43]/20 bg-[#F5F5F0] p-0.5">
              <button
                type="button"
                onClick={() => handleModeChange("ai")}
                aria-pressed={mode === "ai"}
                className={cn(
                  "rounded-[2px] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer",
                  mode === "ai"
                    ? "bg-[#0B1F33] text-white"
                    : "text-[#102A43] hover:text-[#2563EB]"
                )}
              >
                vs AI
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("pvp")}
                aria-pressed={mode === "pvp"}
                className={cn(
                  "rounded-[2px] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer",
                  mode === "pvp"
                    ? "bg-[#0B1F33] text-white"
                    : "text-[#102A43] hover:text-[#2563EB]"
                )}
              >
                2 Players
              </button>
            </div>

            {/* Mark Toggle (AI Mode Only) */}
            {mode === "ai" ? (
              <div className="inline-flex rounded-[2px] border border-[#102A43]/20 bg-[#F5F5F0] p-0.5">
                <button
                  type="button"
                  onClick={() => handleMarkChange("X")}
                aria-pressed={humanMark === "X"}
                  className={cn(
                    "rounded-[2px] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer",
                    humanMark === "X"
                      ? "bg-[#0B1F33] text-white"
                      : "text-[#102A43] hover:text-[#2563EB]"
                  )}
                >
                  Play X
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkChange("O")}
                aria-pressed={humanMark === "O"}
                  className={cn(
                    "rounded-[2px] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer",
                    humanMark === "O"
                      ? "bg-[#0B1F33] text-white"
                      : "text-[#102A43] hover:text-[#2563EB]"
                  )}
                >
                  Play O
                </button>
              </div>
            ) : null}
          </div>

          {/* Difficulty Selector */}
          {mode === "ai" ? (
            <div className="grid grid-cols-3 gap-2 border-t border-[#102A43]/10 pt-3">
              {DIFFICULTY_OPTIONS.map((option) => {
                const active = difficulty === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDifficultyChange(option.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-[2px] border py-2 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer",
                      active
                        ? "border-[#2563EB] bg-[#2563EB] text-white"
                        : "border-[#102A43]/15 bg-[#F5F5F0]/60 text-[#102A43] hover:border-[#0B1F33]"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Main Centered Board Card */}
        <div className="overflow-hidden rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white shadow-[0_4px_18px_rgba(11,31,51,0.06)]">
          {/* Inline Deep Navy Scoreboard */}
          <div className="grid grid-cols-3 divide-x divide-white/12 bg-[#0B1F33] text-center text-white">
            <div
              className={cn(
                "px-3 py-3.5 transition-colors",
                !isGameOver && currentTurn === "X" && "bg-white/10"
              )}
            >
              <p className="font-mono text-[10px] tracking-[0.1em] text-slate-300 uppercase">
                {xLabel}
              </p>
              <p className="mt-0.5 font-display text-2xl font-bold text-white">
                {scores.x}
              </p>
            </div>

            <div className="px-3 py-3.5">
              <p className="font-mono text-[10px] tracking-[0.1em] text-slate-300 uppercase">
                Draws
              </p>
              <p className="mt-0.5 font-display text-2xl font-bold text-slate-200">
                {scores.draws}
              </p>
            </div>

            <div
              className={cn(
                "px-3 py-3.5 transition-colors",
                !isGameOver && currentTurn === "O" && "bg-white/10"
              )}
            >
              <p className="font-mono text-[10px] tracking-[0.1em] text-slate-300 uppercase">
                {oLabel}
              </p>
              <p className="mt-0.5 font-display text-2xl font-bold text-[#60A5FA]">
                {scores.o}
              </p>
            </div>
          </div>

          {/* 3x3 Grid */}
          <div className="p-5 sm:p-7">
            <div
              role="group"
              aria-label="Tic-Tac-Toe Board"
              className="mx-auto grid max-w-[380px] grid-cols-3 gap-3"
            >
              {board.map((cell, index) => {
                const isWinningCell = result.line?.includes(index) ?? false;
                const isHinted = hintIndex === index && cell === null;
                const row = Math.floor(index / 3) + 1;
                const col = (index % 3) + 1;

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={
                      cell !== null || isGameOver || isAiThinking || isAiTurn
                    }
                    onClick={() => handleCellClick(index)}
                    aria-label={`Row ${row}, Column ${col}: ${cell ?? "Empty"}`}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-[2px] border-[1.5px] transition-colors duration-150",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
                      isWinningCell
                        ? "border-[#0B1F33] bg-[#0B1F33]"
                        : isHinted
                          ? "border-[#2563EB] bg-[#2563EB]/10"
                          : cell === null && !isGameOver && !isAiTurn
                            ? "border-[#102A43]/20 bg-[#F5F5F0]/65 hover:border-[#0B1F33] hover:bg-white cursor-pointer"
                            : "border-[#102A43]/15 bg-[#F5F5F0]/35"
                    )}
                  >
                    {cell ? (
                      <MarkIcon mark={cell} isWinning={isWinningCell} />
                    ) : isHinted ? (
                      <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#2563EB] uppercase">
                        Best
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Status & Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#102A43]/12 bg-[#F5F5F0]/60 px-5 py-4 sm:px-6">
            <p role="status" aria-live="polite" className="font-display text-base font-bold text-[#102A43]">
              {statusText}
            </p>

            <div className="flex items-center gap-2">
              {!isGameOver ? (
                <button
                  type="button"
                  disabled={isAiThinking || isAiTurn}
                  onClick={handleShowHint}
                  className="rounded-[2px] border border-[#102A43]/25 bg-white px-3 py-2 font-mono text-[11px] font-semibold tracking-[0.08em] text-[#102A43] uppercase transition-colors hover:border-[#0B1F33] disabled:opacity-45 cursor-pointer"
                >
                  Hint
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleNewRound}
                className="rounded-[2px] bg-[#0B1F33] px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#102A43] cursor-pointer"
              >
                {isGameOver ? "Play Again" : "Restart"}
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                className="rounded-[2px] px-2.5 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-[#4B5563] uppercase transition-colors hover:text-[#0B1F33] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Fail / Big Retry Overlay */}
      {showFailOverlay ? (
        <Modal
          onClose={() => setShowFailOverlay(false)}
          labelledBy="game-fail-title"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#0B1F33]/88 px-6 py-6 text-center text-white backdrop-blur-md"
        >
          <div className="flex w-full max-w-md flex-col items-center space-y-6">
            <p className="font-mono text-xs font-semibold tracking-[0.18em] text-[#60A5FA] uppercase">
              Round Lost
            </p>

            <h2
              id="game-fail-title"
              className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl"
            >
              YOU LOST.
            </h2>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300 sm:text-base">
              The AI closed out the board on {difficulty} mode. Take another
              shot.
            </p>

            <button
              type="button"
              onClick={handleNewRound}
              className="inline-flex w-full items-center justify-center gap-3.5 rounded-[2px] bg-[#2563EB] px-8 py-6 font-display text-2xl font-bold tracking-[0.12em] text-white uppercase transition-colors duration-150 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer sm:py-7 sm:text-3xl"
            >
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Retry</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFailOverlay(false)}
              className="font-mono text-xs font-medium tracking-[0.14em] text-slate-300 uppercase transition-colors hover:text-white cursor-pointer"
            >
              View Board
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
