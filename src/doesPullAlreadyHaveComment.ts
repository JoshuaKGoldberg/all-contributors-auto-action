import * as github from "@actions/github";

import { commentPrefix } from "./comments.js";

export async function doesPullAlreadyHaveComment(
	octokit: ReturnType<typeof github.getOctokit>,
	id: number
) {
	const existingComments = await octokit.request(
		"GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			owner: "OWNER",
			repo: "REPO",
			issue_number: id,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	return existingComments.data.find(({ body }) =>
		body?.includes(commentPrefix)
	);
}
