import {StorageState} from "./utils/StorageState.svelte";

export type Language = "cs" | "en";

export interface Settings {
	language: Language;
	maxAttempts: number;
}

export const settings = new StorageState<Settings>("local", "wordle-settings", {
	language: "cs",
	maxAttempts: 5,
});
