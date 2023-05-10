import { describe, expect, it, vi } from "vitest";

import { getExistingContributors } from "./getExistingContributors.js";
import { AllContributorsConfig } from "./types.js";

let mockContents: AllContributorsConfig;

vi.mock("node:fs/promises", () => ({
	default: {
		readFile: () => Promise.resolve(JSON.stringify(mockContents, null, 4)),
	},
}));

describe("getExistingContributors", () => {
	it("returns an empty object when there are no existing contributors", async () => {
		mockContents = {};

		const actual = await getExistingContributors();

		expect(actual).toEqual({});
	});

	it("returns an object with contributors when there are existing contributors", async () => {
		mockContents = {
			contributors: [
				{
					contributions: ["bug"],
					login: "abc",
				},
				{
					contributions: ["code", "design"],
					login: "def",
				},
			],
		};

		const actual = await getExistingContributors();

		expect(actual).toEqual({
			abc: new Set(["bug"]),
			def: new Set(["code", "design"]),
		});
	});
});
