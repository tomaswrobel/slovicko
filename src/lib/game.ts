import {WORD_LENGTH} from "./wordLength";

export type TileState = "correct" | "present" | "absent" | "empty" | "active";
export type EvaluatedState = "correct" | "present" | "absent";

export function evaluateGuess(guess: string[], target: string): EvaluatedState[] {
	const states: EvaluatedState[] = Array(WORD_LENGTH).fill("absent");
	const remaining = target.split("");

	// First pass: greens
	for (let column = 0; column < WORD_LENGTH; column++) {
		if (guess[column] === remaining[column]) {
			states[column] = "correct";
			remaining[column] = "";
		}
	}

	// Second pass: yellows (only from letters not consumed by greens)
	for (let column = 0; column < WORD_LENGTH; column++) {
		if (states[column] === "correct") continue;
		const index = remaining.indexOf(guess[column]!);
		if (index !== -1) {
			states[column] = "present";
			remaining[index] = "";
		}
	}

	return states;
}

export function getTileState(
	row: number,
	column: number,
	guesses: string[][],
	currentRow: number,
	currentInput: string,
	gameOver: boolean,
	target: string,
): TileState {
	const guess = guesses[row];
	if (row === currentRow && !gameOver) {
		return currentInput[column] ? "active" : "empty";
	}
	if (!guess || guess.length === 0) return "empty";
	return evaluateGuess(guess, target)[column] ?? "empty";
}

export function getKeyColor(
	letter: string,
	guesses: string[][],
	currentRow: number,
	target: string,
): "correct" | "present" | "absent" | undefined {
	let best: "correct" | "present" | "absent" | undefined;
	for (let rowIndex = 0; rowIndex < currentRow; rowIndex++) {
		const guess = guesses[rowIndex];
		if (!guess) {
			continue;
		}
		const states = evaluateGuess(guess, target);
		for (let colIndex = 0; colIndex < guess.length; colIndex++) {
			if (guess[colIndex] !== letter) {
				continue;
			}
			const cellState = states[colIndex]!;
			if (cellState === "correct") {
				return "correct";
			}
			if (cellState === "present") {
				best = "present";
			} else {
				best ??= "absent";
			}
		}
	}
	return best;
}
