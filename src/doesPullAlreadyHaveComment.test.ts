import { describe, expect, it, vi } from "vitest";

import { commentPrefix } from "./comments.js";
import { doesPullAlreadyHaveComment } from "./doesPullAlreadyHaveComment.js";

const mockListComments = vi.fn();
const mockPaginate = vi.fn();

const mockOctokit = {
	paginate: mockPaginate,
	rest: { issues: { listComments: mockListComments } },
} as unknown as Parameters<typeof doesPullAlreadyHaveComment>[0];

const locator = { owner: "", repo: "" };

describe("doesPullAlreadyHaveComment", () => {
	it("returns undefined when no existing comment body includes the comment prefix", async () => {
		mockPaginate.mockResolvedValue([{}]);

		const actual = await doesPullAlreadyHaveComment(mockOctokit, locator, 1);

		expect(actual).toBe(undefined);
	});

	it("returns the comment when an existing comment body includes the comment prefix", async () => {
		const comment = { body: `${commentPrefix} Yippee!` };
		mockPaginate.mockResolvedValue([comment]);

		const actual = await doesPullAlreadyHaveComment(mockOctokit, locator, 1);

		expect(actual).toBe(comment);
	});

	it("requests all pages of comments", async () => {
		mockPaginate.mockResolvedValue([]);

		await doesPullAlreadyHaveComment(mockOctokit, locator, 1);

		expect(mockPaginate).toHaveBeenCalledWith(
			mockListComments,
			expect.objectContaining({ issue_number: 1, per_page: 100 }),
		);
	});
});
