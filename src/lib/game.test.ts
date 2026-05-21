import {describe, expect, it} from "vitest";
import {evaluateGuess, getKeyColor, getTileState} from "./game";

describe("evaluateGuess", () => {
	it("all correct", () => {
		expect(evaluateGuess([..."hello"], "hello")).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});

	it("all absent", () => {
		expect(evaluateGuess([..."bbbbb"], "aaaaa")).toEqual([
			"absent",
			"absent",
			"absent",
			"absent",
			"absent",
		]);
	});

	it("all present", () => {
		expect(evaluateGuess([..."abcde"], "eabcd")).toEqual([
			"present",
			"present",
			"present",
			"present",
			"present",
		]);
	});

	it("duplicate in guess, single in target — second gets absent", () => {
		// DREAD vs DURYL: first D is green, second D must be absent (not yellow)
		expect(evaluateGuess([..."dread"], "duryl")).toEqual([
			"correct",
			"present",
			"absent",
			"absent",
			"absent",
		]);
	});

	it("duplicate in target, one match in guess gets yellow", () => {
		// target has two A's, guess has one A not at a green position → yellow
		expect(evaluateGuess([..."xxxax"], "aabcd")).toEqual([
			"absent",
			"absent",
			"absent",
			"present",
			"absent",
		]);
	});

	it("duplicate in guess matches two in target", () => {
		// target AABBB, guess AACCC — both A's green
		expect(evaluateGuess([..."aaccc"], "aabbb")).toEqual([
			"correct",
			"correct",
			"absent",
			"absent",
			"absent",
		]);
	});

	it("green takes priority over yellow for same letter", () => {
		// target ABCDE, guess AACDE — first A green, second A absent
		expect(evaluateGuess([..."aacde"], "abcde")).toEqual([
			"correct",
			"absent",
			"correct",
			"correct",
			"correct",
		]);
	});
});

describe("getTileState", () => {
	const guesses = [[..."dread"], [..."crane"]];
	const target = "duryl";

	it("returns active for current row with typed letter", () => {
		expect(getTileState(2, 0, guesses, 2, "abc", false, target)).toBe("active");
	});

	it("returns empty for current row with no letter", () => {
		expect(getTileState(2, 4, guesses, 2, "abc", false, target)).toBe("empty");
	});

	it("returns empty for future row", () => {
		expect(getTileState(3, 0, guesses, 2, "abc", false, target)).toBe("empty");
	});

	it("returns evaluated state for submitted row", () => {
		expect(getTileState(0, 0, guesses, 2, "", false, target)).toBe("correct");
		expect(getTileState(0, 4, guesses, 2, "", false, target)).toBe("absent");
	});
});

describe("getKeyColor", () => {
	it("returns undefined with no guesses", () => {
		expect(getKeyColor("a", [], 0, "hello")).toBeUndefined();
	});

	it("returns correct when letter was in right position", () => {
		expect(getKeyColor("h", [[..."hello"]], 1, "hello")).toBe("correct");
	});

	it("returns present when letter exists but wrong position", () => {
		expect(getKeyColor("e", [[..."echos"]], 1, "hello")).toBe("present");
	});

	it("returns absent when letter not in target", () => {
		expect(getKeyColor("z", [[..."zzzzz"]], 1, "hello")).toBe("absent");
	});

	it("correct beats present across rows", () => {
		const guesses = [[..."oellh"], [..."hello"]];
		// 'h' is present in row 0 (wrong pos), correct in row 1
		expect(getKeyColor("h", guesses, 2, "hello")).toBe("correct");
	});

	it("present beats absent", () => {
		const guesses = [[..."zzzzz"], [..."salve"]];
		// 'a' absent in row 0, present in row 1
		expect(getKeyColor("a", guesses, 2, "apple")).toBe("present");
	});
});
