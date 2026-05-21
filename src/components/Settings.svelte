<script lang="ts">
	import {settings} from "../lib/settings.svelte";
	import {getTranslations} from "../lib/i18n";

	const t = $derived(getTranslations());
	let dialogElement = $state<HTMLDialogElement>();

	export function open() {
		dialogElement?.showModal();
	}
</script>

<dialog bind:this={dialogElement} class={["modal"]}>
	<div class={["modal-box", "flex", "flex-col", "gap-6"]}>
		<h3 class={["font-black", "text-lg", "tracking-wide", "uppercase"]}>{t.settingsTitle}</h3>

		<label class={["form-control", "w-full"]}>
			<div class="label">
				<span class="label-text">{t.languageLabel}</span>
			</div>
			<select class={["select", "select-bordered", "w-full"]} bind:value={settings.value.language}>
				<option value="cs">Čeština</option>
				<option value="en">English</option>
			</select>
		</label>

		<label class={["form-control", "w-full"]}>
			<div class="label">
				<span class="label-text">{t.maxAttemptsLabel}</span>
				<span class={["label-text-alt", "font-bold", "text-base"]}>
					{settings.value.maxAttempts}
				</span>
			</div>
			<input
				type="range"
				min="3"
				max="7"
				class={["range", "range-primary", "w-full"]}
				bind:value={settings.value.maxAttempts}
			/>
			<div class={["flex", "justify-between", "text-xs", "px-1", "mt-1", "opacity-60"]}>
				{#each [3, 4, 5, 6, 7] as attempt}
					<span>{attempt}</span>
				{/each}
			</div>
		</label>

		<div class={["modal-action"]}>
			<form method="dialog">
				<button class={["btn", "btn-primary"]}>{t.save}</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>{t.close}</button>
	</form>
</dialog>
