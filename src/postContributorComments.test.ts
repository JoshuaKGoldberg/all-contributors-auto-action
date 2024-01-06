import { describe, expect, it, vi } from "vitest";

import { postContributorComments } from "./postContributorComments.js";

vi.mock("@actions/core");

const mockPostContributionComment = vi.fn();

vi.mock("./postContributionComment.js", () => ({
	get postContributionComment() {
		return mockPostContributionComment;
	},
}));

const contributor = "Test-Contributor";

describe("postContributorComments", () => {
	it("doesn't post comments when the contributor is not missing any contributions", async () => {
		await postContributorComments(contributor, {}, {});

		expect(mockPostContributionComment).not.toHaveBeenCalled();
	});

	it("post a comment for each missing contribution when they exist", async () => {
		const contribution = 111;
		await postContributorComments(
			contributor,
			{
				fix: [contribution],
			},
			{},
		);

		expect(mockPostContributionComment).toHaveBeenCalledWith(
			contributor,
			contribution,
			"fix",
		);
	});
});
