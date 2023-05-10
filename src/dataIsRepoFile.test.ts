import { describe, expect, it } from "vitest";

import { dataIsRepoFile } from "./dataIsRepoFile.js";

describe("dataIsRepoFile", () => {
	it.each([
		[null, false],
		[undefined, false],
		[{}, false],
		[{ type: "folder" }, false],
		[{ content: "{}" }, false],
		[{ content: "{}", type: "file" }, true],
	])("when given %j, returns %s", (event, expected) => {
		const actual = dataIsRepoFile(event);

		expect(actual).toBe(expected);
	});
});
