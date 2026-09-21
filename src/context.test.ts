import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetGitHubAuthToken = vi.fn();
const mockGetOctokit = vi.fn();

vi.mock("@actions/github", () => ({
	context: {
		repo: {
			owner: "Mock-Owner",
			repo: "test-repository",
		},
	},
	getOctokit: mockGetOctokit,
}));

vi.mock("get-github-auth-token", () => ({
	getGitHubAuthToken: mockGetGitHubAuthToken,
}));

describe("context", () => {
	beforeEach(() => {
		vi.resetModules();
		mockGetOctokit.mockClear();
	});

	it("throws an error with the cause when a GitHub token could not be found", async () => {
		mockGetGitHubAuthToken.mockResolvedValue({
			error: "Could not run `gh`: oh no",
			succeeded: false,
		});

		await expect(import("./context.js")).rejects.toThrow(
			expect.objectContaining({
				cause: "Could not run `gh`: oh no",
				message: expect.stringContaining("Could not find a GitHub token."),
			}),
		);
		expect(mockGetOctokit).not.toHaveBeenCalled();
	});

	it("creates an Octokit with the token when a GitHub token is found", async () => {
		mockGetGitHubAuthToken.mockResolvedValue({
			succeeded: true,
			token: "gh_abc123",
		});

		const { githubToken } = await import("./context.js");

		expect(githubToken).toBe("gh_abc123");
		expect(mockGetOctokit).toHaveBeenCalledWith("gh_abc123");
	});
});
