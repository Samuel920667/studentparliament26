// src/lib/tictactoe-ai.ts
export type PlayerMark = "X" | "O";
export type CellValue = PlayerMark | null;
export type BoardState = CellValue[];

export type GameMode = "ai" | "pvp";
export type Difficulty = "casual" | "smart" | "unbeatable";

export interface WinResult {
  winner: PlayerMark | "draw" | null;
  line: readonly [number, number, number] | null;
}

export const WINNING_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): BoardState {
  return Array<CellValue>(9).fill(null);
}

export function getOpponent(mark: PlayerMark): PlayerMark {
  return mark === "X" ? "O" : "X";
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

export function evaluateBoard(board: BoardState): WinResult {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cell = board[a];
    if (cell && cell === board[b] && cell === board[c]) {
      return { winner: cell, line };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: "draw", line: null };
  }

  return { winner: null, line: null };
}

function findImmediateWinningMove(
  board: BoardState,
  mark: PlayerMark
): number | null {
  for (const [a, b, c] of WINNING_LINES) {
    const cells = [board[a], board[b], board[c]];
    const markCount = cells.filter((cell) => cell === mark).length;
    const emptyCount = cells.filter((cell) => cell === null).length;

    if (markCount === 2 && emptyCount === 1) {
      if (board[a] === null) return a;
      if (board[b] === null) return b;
      if (board[c] === null) return c;
    }
  }

  return null;
}

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiMark: PlayerMark,
  humanMark: PlayerMark,
  alpha: number,
  beta: number
): number {
  const { winner } = evaluateBoard(board);

  if (winner === aiMark) return 10 - depth;
  if (winner === humanMark) return depth - 10;
  if (winner === "draw") return 0;

  const available = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of available) {
      board[index] = aiMark;
      const score = minimax(
        board,
        depth + 1,
        false,
        aiMark,
        humanMark,
        alpha,
        beta
      );
      board[index] = null;

      if (score > bestScore) bestScore = score;
      if (bestScore > alpha) alpha = bestScore;
      if (beta <= alpha) break;
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const index of available) {
    board[index] = humanMark;
    const score = minimax(
      board,
      depth + 1,
      true,
      aiMark,
      humanMark,
      alpha,
      beta
    );
    board[index] = null;

    if (score < bestScore) bestScore = score;
    if (bestScore < beta) beta = bestScore;
    if (beta <= alpha) break;
  }

  return bestScore;
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getBestAiMove(
  board: BoardState,
  aiMark: PlayerMark,
  difficulty: Difficulty
): number | null {
  if (evaluateBoard(board).winner !== null) return null;
  const available = getAvailableMoves(board);
  if (available.length === 0) return null;

  const humanMark = getOpponent(aiMark);

  // Instant optimal opening variety on an empty board
  if (available.length === 9) {
    if (difficulty === "unbeatable") {
      return pickRandom([0, 2, 4, 6, 8]);
    }
    return pickRandom(available);
  }

  // Casual: occasionally spots wins/blocks, otherwise plays freely
  if (difficulty === "casual") {
    const winNow = findImmediateWinningMove(board, aiMark);
    if (winNow !== null && Math.random() < 0.6) return winNow;

    const blockNow = findImmediateWinningMove(board, humanMark);
    if (blockNow !== null && Math.random() < 0.45) return blockNow;

    return pickRandom(available);
  }

  // Smart normally spots threats, but occasionally overlooks a move.
  if (difficulty === "smart") {
    if (Math.random() < 0.2) return pickRandom(available);
    const winNow = findImmediateWinningMove(board, aiMark);
    if (winNow !== null) return winNow;

    const blockNow = findImmediateWinningMove(board, humanMark);
    if (blockNow !== null && Math.random() < 0.9) return blockNow;

    if (board[4] === null) return 4;
    const openCorners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (openCorners.length > 0) return pickRandom(openCorners);
    return pickRandom(available);
  }

  // Unbeatable is an opt-in challenge using full minimax.
  const workingBoard = [...board];
  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const index of available) {
    workingBoard[index] = aiMark;
    const score = minimax(
      workingBoard,
      0,
      false,
      aiMark,
      humanMark,
      -Infinity,
      Infinity
    );
    workingBoard[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [index];
    } else if (score === bestScore) {
      bestMoves.push(index);
    }
  }

  return pickRandom(bestMoves);
}
