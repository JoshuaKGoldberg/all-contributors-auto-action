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

	it("posts a comment for a missing contribution when it exists", async () => {
		const contribution = 111;
		await postContributorComments(
			contributor,
			{
				fix: [contribution],
			},
			{},
		);

		expect(mockPostContributionComment).toHaveBeenCalledExactlyOnceWith(
			contributor,
			contribution,
			["fix"],
		);
	});

	it("posts a single comment for multiple missing contribution types that share the same latest id", async () => {
		await postContributorComments(
			contributor,
			{
				bug: [111, 222],
				maintenance: [222],
			},
			{},
		);

		expect(mockPostContributionComment).toHaveBeenCalledExactlyOnceWith(
			contributor,
			222,
			["bug", "maintenance"],
		);
	});

	it("posts separate comments for missing contribution types with different latest ids", async () => {
		await postContributorComments(
			contributor,
			{
				bug: [111],
				maintenance: [222, 333],
			},
			{},
		);

		expect(mockPostContributionComment).toHaveBeenCalledTimes(2);
		expect(mockPostContributionComment).toHaveBeenCalledWith(contributor, 111, [
			"bug",
		]);
		expect(mockPostContributionComment).toHaveBeenCalledWith(contributor, 333, [
			"maintenance",
		]);
	});
});
