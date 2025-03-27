import { commentPrefix } from "./comments.js";
import { Locator, Octokit } from "./types.js";

export async function doesPullAlreadyHaveComment(
	octokit: Octokit,
	locator: Locator,
	id: number,
) {
	const existingComments = await octokit.request(
		"GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			...locator,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			issue_number: id,
		},
	);

	return existingComments.data.find(({ body }) =>
		body?.includes(commentPrefix),
	);
}
