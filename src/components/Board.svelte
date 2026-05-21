<script lang="ts">
	import {WORD_LENGTH} from "../lib/wordLength";

	type TileState = "correct" | "present" | "absent" | "empty" | "active";

	interface Props {
		maxAttempts: number;
		guesses: string[][];
		currentRow: number;
		currentInput: string;
		gameOver: boolean;
		shake: boolean;
		getTileState: (row: number, col: number) => TileState;
	}

	const {maxAttempts, guesses, currentRow, currentInput, gameOver, shake, getTileState}: Props = $props();
</script>

<div class={["flex", "flex-col", "items-center", "gap-1.5", "my-6"]}>
	{#each Array.from({length: maxAttempts}) as _, row (row)}
		<div class={["flex", "gap-1.5", shake && row === currentRow && "shake"]}>
			{#each Array.from({length: WORD_LENGTH}) as _, col}
				{@const tileState = getTileState(row, col)}
				{@const letter = row === currentRow && !gameOver ? currentInput[col] : guesses[row]?.[col]}
				<div
					class={[
						"tile",
						"w-14",
						"h-14",
						"sm:w-16",
						"sm:h-16",
						"border-2",
						"rounded",
						"flex",
						"items-center",
						"justify-center",
						"text-2xl",
						"sm:text-3xl",
						"font-black",
						"uppercase",
						"select-none",
						tileState === "correct" && "bg-success text-success-content border-success",
						tileState === "present" && "bg-warning text-warning-content border-warning",
						tileState === "absent" && "bg-neutral text-neutral-content border-neutral",
						tileState === "active" && "border-base-content/50 scale-105",
						tileState === "empty" && "border-base-300",
					]}
				>
					{letter ?? ""}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.shake {
		animation: shake 0.4s ease;
	}

	.tile {
		transition:
			background 0.25s,
			border-color 0.25s,
			transform 0.1s;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-6px);
		}
		40% {
			transform: translateX(6px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(4px);
		}
	}
</style>
