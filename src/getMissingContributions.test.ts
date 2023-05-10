import { describe, expect, it } from "vitest";

import { getMissingContributions } from "./getMissingContributions.js";

const contributor = "abc123";

describe("getMissingContributions", () => {
	it("returns the contributions when the contributor doesn't yet exist", () => {
		const contributions = { bug: [123], tool: [456, 789] };

		const actual = getMissingContributions(contributor, contributions, {});

		expect(actual).toEqual(contributions);
	});

	it("returns only new contributions in sorted order when the contributor already exists", () => {
		const contributions = { bug: [123], tool: [789, 456] };

		const actual = getMissingContributions(contributor, contributions, {
			[contributor]: new Set(["bug"]),
		});

		expect(actual).toEqual({ tool: [456, 789] });
	});
});
