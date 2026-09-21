import { describe, expect, it, vi } from "vitest";

import { resolveSince } from "./resolveSince.js";

const mockGetPreviousRunTime = vi.fn();

vi.mock("./getPreviousRunTime.js", () => ({
	get getPreviousRunTime() {
		return mockGetPreviousRunTime;
	},
}));

const mockOctokit = {} as Parameters<typeof resolveSince>[1];

const locator = {
	owner: "",
	repo: "",
};

const runId = 123;

const now = new Date("2026-01-08T00:00:00.000Z");

describe(resolveSince, () => {
	it.each(["", "auto", " Auto "])(
		"returns the previous run time when the input is %j",
		async (input) => {
			const previousRunTime = new Date("2026-01-07T00:00:00.000Z");
			mockGetPreviousRunTime.mockResolvedValueOnce(previousRunTime);

			const actual = await resolveSince(
				input,
				mockOctokit,
				locator,
				runId,
				now,
			);

			expect(actual).toBe(previousRunTime);
			expect(mockGetPreviousRunTime).toHaveBeenCalledWith(
				mockOctokit,
				locator,
				runId,
			);
		},
	);

	it("returns undefined when the input is 'all'", async () => {
		const actual = await resolveSince("all", mockOctokit, locator, runId, now);

		expect(actual).toBeUndefined();
	});

	it.each([
		["12h", "2026-01-07T12:00:00.000Z"],
		["7d", "2026-01-01T00:00:00.000Z"],
		["1w", "2026-01-01T00:00:00.000Z"],
		["2 D", "2026-01-06T00:00:00.000Z"],
	])(
		"returns now minus the duration when the input is %j",
		async (input, expected) => {
			const actual = await resolveSince(
				input,
				mockOctokit,
				locator,
				runId,
				now,
			);

			expect(actual).toEqual(new Date(expected));
		},
	);

	it("returns the date when the input is an ISO 8601 date", async () => {
		const actual = await resolveSince(
			"2025-12-25T10:00:00Z",
			mockOctokit,
			locator,
			runId,
			now,
		);

		expect(actual).toEqual(new Date("2025-12-25T10:00:00.000Z"));
	});

	it("throws an error when the input is not recognized", async () => {
		await expect(
			resolveSince("yesterday", mockOctokit, locator, runId, now),
		).rejects.toThrow(`Invalid 'since' input: "yesterday".`);
	});
});
