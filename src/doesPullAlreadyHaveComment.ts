import { commentPrefix } from "./comments.js";
import { Locator, Octokit } from "./types.js";

export async function doesPullAlreadyHaveComment(
	octokit: Octokit,
	locator: Locator,
	id: number,
) {
	// Comments are paginated, so an existing comment may be past the first page
	const existingComments = await octokit.paginate(
		octokit.rest.issues.listComments,
		{
			...locator,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			issue_number: id,
			per_page: 100,
		},
	);

	return existingComments.find(({ body }) => body?.includes(commentPrefix));
}
