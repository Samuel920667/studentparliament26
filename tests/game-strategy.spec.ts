import { test, expect } from "@playwright/test";
import { createEmptyBoard, evaluateBoard, getBestAiMove, type BoardState, type Difficulty, type PlayerMark } from "../src/lib/tictactoe-ai";

function withRandom(random: () => number, check: () => void) {
  const original = Math.random;
  Math.random = random;
  try { check(); } finally { Math.random = original; }
}

test("Casual and Smart allow human wins; Unbeatable draws against optimal play", () => {
  for (const difficulty of ["casual", "smart", "unbeatable"] as const) {
    let state = 7654321;
    let wins = 0;
    withRandom(() => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 2 ** 32;
    }, () => {
      for (let round = 0; round < 40; round++) {
        const board = createEmptyBoard();
        let turn: PlayerMark = "X";
        while (evaluateBoard(board).winner === null) {
          const snapshot = [...board];
          const move = getBestAiMove(board, turn, turn === "X" ? "unbeatable" : difficulty);
          expect(board).toEqual(snapshot);
          expect(move).not.toBeNull();
          expect(board[move!]).toBeNull();
          board[move!] = turn;
          turn = turn === "X" ? "O" : "X";
        }
        const result = evaluateBoard(board).winner;
        expect(result).not.toBe("O");
        if (result === "X") wins++;
        if (difficulty === "unbeatable") expect(result).toBe("draw");
      }
    });
    if (difficulty !== "unbeatable") expect(wins).toBeGreaterThan(0);
  }
});

test("AI stops on completed boards and Smart normally wins or blocks immediate threats", () => {
  const finished: BoardState = ["X", "X", "X", "O", "O", null, null, null, null];
  for (const difficulty of ["casual", "smart", "unbeatable"] as Difficulty[]) {
    expect(getBestAiMove(finished, "O", difficulty)).toBeNull();
    expect(getBestAiMove(["X", "O", "X", "X", "O", "O", "O", "X", "X"], "O", difficulty)).toBeNull();
  }
  withRandom(() => 0.5, () => {
    expect(getBestAiMove(["O", "O", null, "X", null, "X", "X", null, null], "O", "smart")).toBe(2);
    expect(getBestAiMove(["X", "X", null, null, "O", null, null, null, null], "O", "smart")).toBe(2);
  });
});

test("a new game defaults to Casual and a player can win a normal round", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.99; });
  await page.goto("/game");
  await expect(page.getByRole("button", { name: "Casual", exact: true })).toHaveAttribute("aria-pressed", "true");
  const board = page.getByRole("group", { name: "Tic-Tac-Toe Board" });
  await board.getByRole("button", { name: "Row 1, Column 1: Empty", exact: true }).click();
  await expect(board.getByRole("button", { name: "Row 3, Column 3: O", exact: true })).toBeVisible();
  await board.getByRole("button", { name: "Row 1, Column 2: Empty", exact: true }).click();
  await expect(board.getByRole("button", { name: "Row 3, Column 2: O", exact: true })).toBeVisible();
  await board.getByRole("button", { name: "Row 1, Column 3: Empty", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("You win");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
