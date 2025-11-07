import { describe, expect, it, vi } from "vitest";

import { postContributionComment } from "./postContributionComment.js";

const mockDebug = vi.fn();

vi.mock("@actions/core", () => ({
	get debug() {
		return mockDebug;
	},
}));

const mockDoesPullAlreadyHaveComment = vi.fn();

vi.mock("./doesPullAlreadyHaveComment.js", () => ({
	get doesPullAlreadyHaveComment() {
		return mockDoesPullAlreadyHaveComment;
	},
}));

const mockRequest = vi.fn(() => ({
	data: { id: 111 },
}));

vi.mock("./context.js", () => ({
	locator: {},
	get octokit() {
		return {
			request: mockRequest,
		};
	},
}));

const contributor = "Test-Contributor";

describe("postContributionComment", () => {
	it("doesn't post a comment when it already exists", async () => {
		mockDoesPullAlreadyHaveComment.mockResolvedValueOnce({});

		await postContributionComment(contributor, 222, "fix");

		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockDebug.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Checking for existing Test-Contributor comment: 222",
			  ],
			  [
			    "222 already has a comment: undefined",
			  ],
			]
		`);
	});

	it("logs to core.debug without posting a comment when the comment doesn't yet exist and LOCAL_TESTING is enabled", async () => {
		mockDoesPullAlreadyHaveComment.mockResolvedValueOnce(undefined);
		process.env.LOCAL_TESTING = "true";

		await postContributionComment(contributor, 222, "fix");

		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockDebug.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Checking for existing Test-Contributor comment: 222",
			  ],
			  [
			    "222 doesn't already have a comment; posting a new one.",
			  ],
			  [
			    "LOCAL_TESTING: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments",{"body":"@all-contributors please add Test-Contributor for fix.\\n\\n> 🤖 Beep boop! This comment was added automatically by [all-contributors-auto-action](https://github.com/marketplace/actions/all-contributors-auto-action).\\n> Not all contributions can be detected from Git & GitHub alone. Please comment any missing contribution types this bot missed.\\n> ...and of course, thank you for contributing! 💙","headers":{"X-GitHub-Api-Version":"2022-11-28"},"issue_number":222}]",
			  ],
			]
		`);
	});

	it("logs to core.debug and posts a comment when the comment doesn't yet exist and LOCAL_TESTING is not enabled", async () => {
		mockDoesPullAlreadyHaveComment.mockResolvedValueOnce(undefined);
		process.env.LOCAL_TESTING = "false";

		await postContributionComment(contributor, 222, "fix");

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
			    {
			      "body": "@all-contributors please add Test-Contributor for fix.

			> 🤖 Beep boop! This comment was added automatically by [all-contributors-auto-action](https://github.com/marketplace/actions/all-contributors-auto-action).
			> Not all contributions can be detected from Git & GitHub alone. Please comment any missing contribution types this bot missed.
			> ...and of course, thank you for contributing! 💙",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "issue_number": 222,
			    },
			  ],
			]
		`);
		expect(mockDebug.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Checking for existing Test-Contributor comment: 222",
			  ],
			  [
			    "222 doesn't already have a comment; posting a new one.",
			  ],
			  [
			    "Posted comment 111 for 222.",
			  ],
			]
		`);
	});
});
