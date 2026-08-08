<script lang="ts">
	import Key from "./Key.svelte";
	import {KEYBOARD_ROWS} from "../lib/keyboardRows";

	interface Props {
		getKeyColor: (letter: string) => "correct" | "present" | "absent" | undefined;
		ontype: (letter: string) => void;
	}

	const {getKeyColor, ontype}: Props = $props();
</script>

<div class={["flex", "flex-col", "items-center", "gap-2", "mt-auto", "pb-6"]}>
	{#each KEYBOARD_ROWS as row (row)}
		<div class={["flex", "gap-1.5", "justify-center"]}>
			{#each row as key (key)}
				<Key {key} {getKeyColor} {ontype} />
			{/each}
		</div>
	{/each}
</div>
