import { getInput, getMultilineInput } from "@actions/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllContributorsForRepositorySpy = vi.fn();
vi.mock("all-contributors-for-repository", () => ({
	getAllContributorsForRepository: getAllContributorsForRepositorySpy,
}));

const mockRepo = "test-repository";

const mockRequest = vi.fn((route: string) => {
	switch (route) {
		case "GET /repos/{owner}/{repo}/actions/runs/{run_id}":
			return {
				data: { workflow_id: 456 },
			};

		case "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs":
			return {
				data: {
					workflow_runs: [{ created_at: "2026-01-07T00:00:00Z", id: 122 }],
				},
			};

		case "GET /repos/{owner}/{repo}/contents/{path}":
			return {
				data: {
					content: JSON.stringify({
						contributors: [
							{
								contributions: ["bug"],
								login: "Existing-Login",
							},
						],
					}),
					type: "file",
				},
			};

		case "POST /repos/{owner}/{repo}/issues/{issue_number}/comments":
			return {
				data: {
					id: 333,
				},
			};
	}
});

const mockListComments = vi.fn();

const mockPaginate = vi.fn(() => []);

const mockOctokit = {
	paginate: mockPaginate,
	request: mockRequest,
	rest: { issues: { listComments: mockListComments } },
};

vi.mock("@actions/core", () => ({
	debug: vi.fn(),
	getInput: vi.fn(),
	getMultilineInput: vi.fn(),
	info: vi.fn(),
}));

vi.mock("@actions/github", () => ({
	context: {
		repo: {
			owner: "Mock-Owner",
			repo: mockRepo,
		},
		runId: 123,
	},
	getOctokit: () => mockOctokit,
}));

describe("end-to-end", () => {
	getAllContributorsForRepositorySpy.mockResolvedValue({
		"Existing-Login": {
			feat: [111],
		},
		"New-Login": {
			ideas: [222],
		},
	});

	beforeEach(() => {
		vi.resetModules();
		getAllContributorsForRepositorySpy.mockClear();
		mockRequest.mockClear();
		vi.mocked(getInput).mockReturnValue("all");
		vi.mocked(getMultilineInput).mockReturnValue([]);
	});

	it("should correctly call with octokit", async () => {
		process.env.GITHUB_TOKEN = "gh_abc123";
		process.env.GITHUB_REPOSITORY = mockRepo;

		await import("./index.js");

		expect(mockPaginate.mock.calls).toMatchInlineSnapshot(`
		[
		  [
		    [MockFunction],
		    {
		      "headers": {
		        "X-GitHub-Api-Version": "2022-11-28",
		      },
		      "issue_number": 111,
		      "owner": "Mock-Owner",
		      "per_page": 100,
		      "repo": "test-repository",
		    },
		  ],
		  [
		    [MockFunction],
		    {
		      "headers": {
		        "X-GitHub-Api-Version": "2022-11-28",
		      },
		      "issue_number": 222,
		      "owner": "Mock-Owner",
		      "per_page": 100,
		      "repo": "test-repository",
		    },
		  ],
		]
	`);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
		[
		  [
		    "GET /repos/{owner}/{repo}/contents/{path}",
		    {
		      "headers": {
		        "X-GitHub-Api-Version": "2022-11-28",
		      },
		      "owner": "Mock-Owner",
		      "path": ".all-contributorsrc",
		      "repo": "test-repository",
		    },
		  ],
		  [
		    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
		    {
		      "body": "@all-contributors please add Existing-Login for feat.

		> 🤖 Beep boop! This comment was added automatically by [all-contributors-auto-action](https://github.com/marketplace/actions/all-contributors-auto-action).
		> Not all contributions can be detected from Git & GitHub alone. Please comment any missing contribution types this bot missed.
		> ...and of course, thank you for contributing! 💙",
		      "headers": {
		        "X-GitHub-Api-Version": "2022-11-28",
		      },
		      "issue_number": 111,
		      "owner": "Mock-Owner",
		      "repo": "test-repository",
		    },
		  ],
		  [
		    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
		    {
		      "body": "@all-contributors please add New-Login for ideas.

		> 🤖 Beep boop! This comment was added automatically by [all-contributors-auto-action](https://github.com/marketplace/actions/all-contributors-auto-action).
		> Not all contributions can be detected from Git & GitHub alone. Please comment any missing contribution types this bot missed.
		> ...and of course, thank you for contributing! 💙",
		      "headers": {
		        "X-GitHub-Api-Version": "2022-11-28",
		      },
		      "issue_number": 222,
		      "owner": "Mock-Owner",
		      "repo": "test-repository",
		    },
		  ],
		]
	`);
	});

	it("should call getAllContributorsForRepository with the correct ignoreLogins option", async () => {
		vi.mocked(getMultilineInput).mockReturnValue(["\\[bot\\]$"]);

		process.env.GITHUB_TOKEN = "gh_abc123";
		process.env.GITHUB_REPOSITORY = mockRepo;

		await import("./index.js");

		const expectedIgnoredLogins = /\[bot\]$/i;
		expect(getAllContributorsForRepositorySpy).toHaveBeenCalledWith(
			expect.objectContaining({
				ignoredLogins: expect.arrayContaining([expectedIgnoredLogins]),
			}),
		);
	});

	it("should not pass since when the since input is 'all'", async () => {
		process.env.GITHUB_TOKEN = "gh_abc123";
		process.env.GITHUB_REPOSITORY = mockRepo;

		await import("./index.js");

		expect(getAllContributorsForRepositorySpy).toHaveBeenCalledWith(
			expect.not.objectContaining({ since: expect.anything() }),
		);
	});

	it("should pass the previous run's time as since when the since input is 'auto'", async () => {
		vi.mocked(getInput).mockReturnValue("auto");

		process.env.GITHUB_TOKEN = "gh_abc123";
		process.env.GITHUB_REPOSITORY = mockRepo;

		await import("./index.js");

		expect(getAllContributorsForRepositorySpy).toHaveBeenCalledWith(
			expect.objectContaining({
				since: new Date("2026-01-07T00:00:00.000Z"),
			}),
		);
	});
});
