import { describe, expect, it, vi } from "vitest";

import { getExistingContributors } from "./getExistingContributors.js";

const mockRequest = vi.fn();

const mockOctokit = { request: mockRequest } as unknown as Parameters<
	typeof getExistingContributors
>[0];

const locator = {
	owner: "",
	repo: "",
};

vi.mock("@actions/core");

describe("getExistingContributors", () => {
	it("throws an error when the .all-contributorsrc file does not exist", async () => {
		mockRequest.mockResolvedValueOnce({ data: {} });

		await expect(getExistingContributors(mockOctokit, locator)).rejects.toEqual(
			new Error(
				`.all-contributorsrc does not seem to exist as a file in this repository?`,
			),
		);
	});

	it("returns an empty object when the .all-contributorsrc file has no contributors", async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				content: JSON.stringify({}),
				type: "file",
			},
		});

		const actual = await getExistingContributors(mockOctokit, locator);

		expect(actual).toEqual({});
	});

	it("returns contributors with contributions when the .all-contributorsrc file has contributors", async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				content: JSON.stringify({
					contributors: [
						{ contributions: ["docs", "ideas"], login: "test-user" },
					],
				}),
				type: "file",
			},
		});

		const actual = await getExistingContributors(mockOctokit, locator);

		expect(actual).toEqual({
			"test-user": new Set(["docs", "ideas"]),
		});
	});
});
