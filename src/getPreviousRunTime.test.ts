import { describe, expect, it, vi } from "vitest";

import { getPreviousRunTime } from "./getPreviousRunTime.js";

const mockRequest = vi.fn();

const mockOctokit = { request: mockRequest } as unknown as Parameters<
	typeof getPreviousRunTime
>[0];

const locator = {
	owner: "fake-owner",
	repo: "fake-repo",
};

const runId = 123;

vi.mock("@actions/core");

describe(getPreviousRunTime, () => {
	it("returns the previous successful run's start time when one exists", async () => {
		mockRequest
			.mockResolvedValueOnce({ data: { workflow_id: 456 } })
			.mockResolvedValueOnce({
				data: {
					workflow_runs: [
						{ created_at: "2026-01-07T00:00:00Z", id: 122 },
						{ created_at: "2026-01-06T00:00:00Z", id: 121 },
					],
				},
			});

		const actual = await getPreviousRunTime(mockOctokit, locator, runId);

		expect(actual).toEqual(new Date("2026-01-07T00:00:00.000Z"));
		expect(mockRequest.mock.calls).toEqual([
			[
				"GET /repos/{owner}/{repo}/actions/runs/{run_id}",
				{
					...locator,
					headers: { "X-GitHub-Api-Version": "2022-11-28" },
					run_id: runId,
				},
			],
			[
				"GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
				{
					...locator,
					headers: { "X-GitHub-Api-Version": "2022-11-28" },
					per_page: 1,
					status: "success",
					workflow_id: 456,
				},
			],
		]);
	});

	it("returns undefined when there is no previous successful run", async () => {
		mockRequest
			.mockResolvedValueOnce({ data: { workflow_id: 456 } })
			.mockResolvedValueOnce({ data: { workflow_runs: [] } });

		const actual = await getPreviousRunTime(mockOctokit, locator, runId);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the request fails", async () => {
		mockRequest.mockRejectedValueOnce(
			new Error("Resource not accessible by integration"),
		);

		const actual = await getPreviousRunTime(mockOctokit, locator, runId);

		expect(actual).toBeUndefined();
	});
});
