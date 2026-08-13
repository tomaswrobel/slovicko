<script lang="ts">
	import Board from "./components/Board.svelte";
	import Keyboard from "./components/Keyboard.svelte";
	import Toast from "./components/Toast.svelte";
	import SettingsDialog from "./components/Settings.svelte";
	import RefreshIcon from "./components/icons/RefreshIcon.svelte";
	import SettingsIcon from "./components/icons/SettingsIcon.svelte";
	import {ENTER, BACKSPACE} from "./lib/keys";
	import {WORD_LENGTH} from "./lib/wordLength";
	import {settings, type Language} from "./lib/settings.svelte";
	import {streak} from "./lib/streak.svelte";
	import {getTranslations} from "./lib/i18n";
	import {getTileState, getKeyColor} from "./lib/game";

	const WORD_LISTS = import.meta.glob<string>("./lib/words/*.txt", {
		eager: true,
		query: "?raw",
		import: "default",
	});

	let settingsDialog = $state<ReturnType<typeof SettingsDialog>>();

	const wordList = $derived.by(() => {
		const list = WORD_LISTS[`./lib/words/${settings.value.language}.txt`];
		if (!list) {
			throw new Error(`Missing word list for language: ${settings.value.language}`);
		}
		return list.split("\n");
	});
	let maxAttempts = $derived(settings.value.maxAttempts);

	const t = $derived(getTranslations());
	let target = $state("");
	let guesses = $state<string[][]>([]);
	let currentRow = $state(0);
	let currentInput = $state("");
	let gameOver = $state(false);
	let won = $state(false);
	let shake = $state(false);
	let message = $state("");

	function pickWord(): string {
		const word = wordList[Math.floor(Math.random() * wordList.length)];
		if (!word) throw new Error("Word list is empty");
		return word;
	}

	function boundGetTileState(row: number, col: number) {
		return getTileState(row, col, guesses, currentRow, currentInput, gameOver, target);
	}

	function boundGetKeyColor(letter: string) {
		return getKeyColor(letter, guesses, currentRow, target);
	}

	function showMessage(msg: string, duration = 1800) {
		message = msg;
		setTimeout(() => {
			message = "";
		}, duration);
	}

	function submit() {
		if (currentInput.length < WORD_LENGTH) {
			shake = true;
			setTimeout(() => (shake = false), 500);
			showMessage(t.notEnoughLetters);
			return;
		}
		if (!wordList.includes(currentInput)) {
			shake = true;
			setTimeout(() => (shake = false), 500);
			showMessage(t.notInWordList);
			return;
		}
		guesses[currentRow] = currentInput.split("");
		if (currentInput === target) {
			gameOver = true;
			won = true;
			streak.value++;
			const winMsg = t.winMessages[Math.floor(Math.random() * t.winMessages.length)];
			if (!winMsg) {
				return;
			}
			showMessage(winMsg, 99999);
		} else if (currentRow === maxAttempts - 1) {
			gameOver = true;
			streak.value = 0;
			showMessage(target.toUpperCase(), 99999);
		}
		currentRow++;
		currentInput = "";
	}

	function type(letter: string) {
		if (gameOver) return;
		if (letter === ENTER) {
			submit();
			return;
		}
		if (letter === BACKSPACE) {
			currentInput = currentInput.slice(0, -1);
			return;
		}
		if (currentInput.length < WORD_LENGTH) currentInput += letter;
	}

	function reset() {
		target = pickWord();
		guesses = Array.from({length: settings.value.maxAttempts}, () => []);
		currentRow = 0;
		currentInput = "";
		gameOver = false;
		won = false;
		message = "";
	}

	function onKeydown(event: KeyboardEvent) {
		if (gameOver || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
			return;
		}
		if (event.key === "Enter") {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
			submit();
			return;
		}
		if (event.key === "Backspace") {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
			currentInput = currentInput.slice(0, -1);
			return;
		}
		const char = event.key.toLowerCase();
		if (/^\p{General_Category=Lowercase_Letter}$/u.test(char)) {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
			type(char);
		}
	}

	$effect(() => {
		void settings.value.language;
		void settings.value.maxAttempts;
		reset();
	});
</script>

<svelte:window onkeydown={onKeydown} />

<SettingsDialog bind:this={settingsDialog} />

<div class={["min-h-svh", "flex", "flex-col", "bg-base-100", "select-none"]}>
	<div class={["navbar", "bg-base-200", "border-b", "border-base-300", "shadow-sm"]}>
		<div class={["navbar-start", "pl-3", "gap-1", "font-bold"]} title={t.streakLabel}>
			<span>🔥</span>
			<span>{streak.value}</span>
		</div>
		<div class="navbar-center">
			<span class={["text-2xl", "font-black", "tracking-widest", "uppercase"]}>Slovíčko</span>
		</div>
		<div class={["navbar-end", "gap-1", "pr-3"]}>
			<button class={["btn", "btn-ghost", "btn-sm"]} onclick={reset} title={t.newGame}>
				<RefreshIcon class="size-5" />
			</button>
			<button
				class={["btn", "btn-ghost", "btn-sm"]}
				onclick={() => settingsDialog?.open()}
				title={t.settingsTitle}
			>
				<SettingsIcon class="size-5" />
			</button>
		</div>
	</div>

	<Toast {message} {won} />

	<Board
		{maxAttempts}
		{guesses}
		{currentRow}
		{currentInput}
		{gameOver}
		{shake}
		getTileState={boundGetTileState}
	/>

	<Keyboard getKeyColor={boundGetKeyColor} ontype={type} />
</div>
