import {settings, type Language} from "./settings.svelte";

interface Translations {
	notEnoughLetters: string;
	notInWordList: string;
	winMessages: string[];
	newGame: string;
	settingsTitle: string;
	languageLabel: string;
	maxAttemptsLabel: string;
	save: string;
	close: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
	cs: {
		notEnoughLetters: "Slovo musí mít 5 písmen",
		notInWordList: "Slovo není ve slovníku",
		winMessages: ["Výborně!", "Skvělé!", "Perfektní!"],
		newGame: "Nová hra",
		settingsTitle: "Nastavení",
		languageLabel: "Jazyk",
		maxAttemptsLabel: "Maximální počet pokusů",
		save: "Uložit",
		close: "zavřít",
	},
	en: {
		notEnoughLetters: "Not enough letters",
		notInWordList: "Not in word list",
		winMessages: ["Brilliant!", "Magnificent!", "Genius!"],
		newGame: "New game",
		settingsTitle: "Settings",
		languageLabel: "Language",
		maxAttemptsLabel: "Maximum attempts",
		save: "Save",
		close: "close",
	},
};

export function getTranslations(): Translations {
	return TRANSLATIONS[settings.value.language];
}
