import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("context", () => {
	beforeEach(() => {
		vi.resetModules();
		mockGetOctokit.mockClear();
	});

	it("throws an error when the GITHUB_TOKEN environment variable is not set", async () => {
		delete process.env.GITHUB_TOKEN;

		await expect(import("./context.js")).rejects.toThrow(
			"The GITHUB_TOKEN environment variable must be set.",
		);
		expect(mockGetOctokit).not.toHaveBeenCalled();
	});

	it("throws an error when the GITHUB_TOKEN environment variable is empty", async () => {
		process.env.GITHUB_TOKEN = "";

		await expect(import("./context.js")).rejects.toThrow(
			"The GITHUB_TOKEN environment variable must be set.",
		);
		expect(mockGetOctokit).not.toHaveBeenCalled();
	});

	it("creates an Octokit with the token when the GITHUB_TOKEN environment variable is set", async () => {
		process.env.GITHUB_TOKEN = "gh_abc123";

		const { githubToken } = await import("./context.js");

		expect(githubToken).toBe("gh_abc123");
		expect(mockGetOctokit).toHaveBeenCalledWith("gh_abc123");
	});
});
