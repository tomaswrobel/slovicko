import {StorageState} from "./utils/StorageState.svelte";

export const streak = new StorageState<number>("local", "wordle-streak", 0);
