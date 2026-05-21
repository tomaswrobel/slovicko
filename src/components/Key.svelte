<script lang="ts">
	import type {MouseEventHandler, PointerEventHandler} from "svelte/elements";
	import {ENTER, BACKSPACE} from "../lib/keys";
	import {settings} from "../lib/settings.svelte";
	import {on} from "svelte/events";

	interface Props {
		key: string;
		color?: "correct" | "present" | "absent";
		ontype: (letter: string) => void;
	}

	const DIACRITICS: Record<string, string[]> = {
		a: ["á"],
		c: ["č"],
		d: ["ď"],
		e: ["é", "ě"],
		i: ["í"],
		n: ["ň"],
		o: ["ó"],
		r: ["ř"],
		s: ["š"],
		t: ["ť"],
		u: ["ú", "ů"],
		y: ["ý"],
		z: ["ž"],
	};

	const {key, color, ontype}: Props = $props();

	const variants = $derived(settings.value.language === "cs" ? (DIACRITICS[key] ?? []) : []);
	const isWide = $derived(key === ENTER || key === BACKSPACE);

	let popoverElement = $state<HTMLElement>();
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let popoverVisible = $state(false);

	function openPopover(anchorElement: HTMLElement) {
		if (!popoverElement || variants.length === 0) return;
		const rect = anchorElement.getBoundingClientRect();
		popoverElement.style.left = `${rect.left + rect.width / 2}px`;
		popoverElement.style.top = `${rect.top - 8}px`;
		popoverElement.showPopover();
		popoverVisible = true;
	}

	function closePopover() {
		popoverElement?.hidePopover();
		popoverVisible = false;
	}

	function closeOnOutside(event: PointerEvent) {
		if (event.target instanceof Element && !popoverElement?.contains(event.target)) {
			closePopover();
		}
	}

	$effect(() => {
		if (!popoverVisible) {
			return;
		}

		return on(window, "pointerdown", closeOnOutside);
	});

	const onPointerDown: PointerEventHandler<HTMLElement> = ({currentTarget}) => {
		if (variants.length === 0) {
			return;
		}
		longPressTimer = setTimeout(() => {
			longPressTimer = null;
			openPopover(currentTarget);
		}, 400);
	};

	function onPointerUp() {
		if (longPressTimer !== null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function onPointerCancel() {
		if (longPressTimer !== null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	const onContextMenu: MouseEventHandler<HTMLElement> = event => {
		if (variants.length === 0) {
			return;
		}
		event.preventDefault();
		openPopover(event.currentTarget);
	};

	function onClick() {
		if (popoverVisible) return;
		ontype(key);
	}

	function pickVariant(variant: string) {
		closePopover();
		ontype(variant);
	}
</script>

<kbd
	role="button"
	tabindex="0"
	class={[
		"kbd",
		"cursor-pointer",
		"select-none",
		"touch-none",
		"transition-colors",
		"duration-150",
		"text-xs",
		"sm:text-sm",
		"font-bold",
		"uppercase",
		"h-10",
		"sm:h-14",
		"flex",
		"items-center",
		"justify-center",
		"relative",
		isWide ? "px-2 min-w-10 sm:px-3 sm:min-w-14" : "min-w-8 sm:min-w-11",
		color === "correct" && "bg-success text-success-content border-success",
		color === "present" && "bg-warning text-warning-content border-warning",
		color === "absent" && "bg-neutral text-neutral-content border-neutral",
	]}
	onclick={onClick}
	onpointerdown={onPointerDown}
	onpointerup={onPointerUp}
	onpointercancel={onPointerCancel}
	oncontextmenu={onContextMenu}
	onkeydown={event => event.key === "Enter" && onClick()}
>
	{key}
	{#if variants.length > 0}
		<span class={["absolute", "bottom-1", "right-1", "size-1", "rounded-full", "bg-base-content/30"]}
		></span>
	{/if}
</kbd>

{#if variants.length > 0}
	<div
		bind:this={popoverElement}
		popover="manual"
		tabindex="0"
		role="dialog"
		class={[
			"fixed",
			"inset-[unset]",
			"m-0",
			"p-1",
			"rounded-box",
			"gap-1",
			"-translate-x-1/2",
			"-translate-y-full",
			"z-100",
			"bg-base-100",
			"border",
			"border-base-300",
			"shadow-lg",
			"[&:popover-open]:flex",
			"backdrop:bg-transparent",
		]}
	>
		<kbd
			role="button"
			tabindex="0"
			class={[
				"kbd",
				"cursor-pointer",
				"select-none",
				"text-sm",
				"sm:text-base",
				"font-bold",
				"uppercase",
				"h-10",
				"sm:h-13",
				"min-w-8",
				"sm:min-w-11",
				"flex",
				"items-center",
				"justify-center",
				"bg-base-200",
			]}
			onclick={() => pickVariant(key)}
			onkeydown={event => event.key === "Enter" && pickVariant(key)}>{key}</kbd
		>
		{#each variants as variant}
			<kbd
				role="button"
				tabindex="0"
				class={[
					"kbd",
					"cursor-pointer",
					"select-none",
					"text-sm",
					"sm:text-base",
					"font-bold",
					"uppercase",
					"h-10",
					"sm:h-13",
					"min-w-8",
					"sm:min-w-11",
					"flex",
					"items-center",
					"justify-center",
					"hover:bg-warning",
					"hover:text-warning-content",
					"hover:border-warning",
					"transition-colors",
				]}
				onclick={() => pickVariant(variant)}
				onkeydown={event => event.key === "Enter" && pickVariant(variant)}>{variant}</kbd
			>
		{/each}
	</div>
{/if}
