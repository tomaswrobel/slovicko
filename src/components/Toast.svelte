<script lang="ts">
	interface Props {
		message: string;
		won: boolean;
	}

	let {message, won}: Props = $props();
</script>

{#if message}
	<div class={["toast", "toast-top", "toast-center", "z-50", "pt-4"]}>
		<div class={["alert", won ? "alert-success" : "alert-info", "font-bold", "text-base", "shadow-lg"]}>
			<span>{message}</span>
		</div>
	</div>
{/if}
