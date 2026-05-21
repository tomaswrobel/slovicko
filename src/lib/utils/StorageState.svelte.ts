export class StorageState<Value> {
	private readonly storageKey: string;
	private readonly reviver?: (this: void, key: string, value: unknown) => unknown;
	private readonly storage?: Storage;
	private storedValue = $state<Value>();
	public loaded = $state(false);

	constructor(
		storageKind: "local" | "session",
		storageKey: string,
		initialValue: Value,
		reviver?: (this: void, key: string, value: unknown) => unknown,
	) {
		this.storageKey = storageKey;
		this.reviver = reviver;

		this.storedValue = structuredClone(initialValue);

		if (typeof window === "undefined") {
			return;
		}
		this.storage = window[`${storageKind}Storage`];

		const storedValue = this.storage.getItem(this.storageKey);
		if (storedValue !== null) {
			try {
				this.storedValue = JSON.parse(storedValue, reviver) as Value;
			} catch {
				// Ignore JSON parse errors
			}
		}

		// To handle a deeply-reactive values change,
		// we need to use $effect to watch for changes and save them to storage.

		this.dispose = $effect.root(() => {
			const listener = this.handleStorageEvent.bind(this);
			window.addEventListener("storage", listener);

			$effect(() => {
				this.saveValueToStorage(this.value);
			});

			return (): void => {
				window.removeEventListener("storage", listener);
			};
		});

		this.loaded = true;
	}

	public dispose(): void {
		// Set in constructor
	}

	private handleStorageEvent(event: StorageEvent): void {
		if (event.storageArea !== this.storage || (event.key !== this.storageKey && event.key !== null)) {
			return;
		}
		const storedValue = this.storage.getItem(this.storageKey);
		if (storedValue) {
			this.storedValue = JSON.parse(storedValue, this.reviver) as Value;
		}
	}

	private saveValueToStorage(value: Value): void {
		if (value === null || value === undefined) {
			this.storage?.removeItem(this.storageKey);
		} else {
			this.storage?.setItem(this.storageKey, JSON.stringify(value));
		}
	}

	public get value(): Value {
		return this.storedValue as Value;
	}

	public set value(newValue: Value) {
		this.storedValue = newValue;
	}
}
