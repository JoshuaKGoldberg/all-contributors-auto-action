import { describe, expect, it, vi } from "vitest";

import { commentPrefix } from "./comments.js";
import { doesPullAlreadyHaveComment } from "./doesPullAlreadyHaveComment.js";

const mockRequest = vi.fn();

const mockOctokit = { request: mockRequest } as unknown as Parameters<
	typeof doesPullAlreadyHaveComment
>[0];

const locator = { owner: "", repo: "" };

describe("doesPullAlreadyHaveComment", () => {
	it("returns undefined when no existing comment body includes the comment prefix", async () => {
		mockRequest.mockResolvedValue({
			data: [{}],
		});

		const actual = await doesPullAlreadyHaveComment(mockOctokit, locator, 1);

		expect(actual).toBe(undefined);
	});

	it("returns the comment when an existing comment body includes the comment prefix", async () => {
		const comment = { body: `${commentPrefix} Yippee!` };
		mockRequest.mockResolvedValue({
			data: [comment],
		});

		const actual = await doesPullAlreadyHaveComment(mockOctokit, locator, 1);

		expect(actual).toBe(comment);
	});
});
