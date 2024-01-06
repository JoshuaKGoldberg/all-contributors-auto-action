import * as core from "@actions/core";

import { commentDisclaimer, commentPrefix } from "./comments.js";
import { locator, octokit } from "./context.js";
import { doesPullAlreadyHaveComment } from "./doesPullAlreadyHaveComment.js";

export async function postContributionComment(
	contributor: string,
	latestId: number,
	type: string,
) {
	core.debug(`Checking for existing ${contributor} comment: ${latestId}`);

	const existingComment = await doesPullAlreadyHaveComment(
		octokit,
		locator,
		latestId,
	);
	if (existingComment) {
		core.debug(`${latestId} already has a comment: ${existingComment.id}`);
		return;
	}

	core.debug(`${latestId} doesn't already have a comment; posting a new one.`);

	const commentRequestArgs = [
		"POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			...locator,
			body: [
				`${commentPrefix} @${contributor} for ${type}.`,
				commentDisclaimer,
			].join("\n\n"),
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
			issue_number: latestId,
		},
	] as const;

	if (process.env.LOCAL_TESTING === "true") {
		core.debug(`LOCAL_TESTING: ${JSON.stringify(commentRequestArgs)}`);
	} else {
		// TODO: It'd be nice to deduplicate these comments.
		// PRs that include multiple types will cause multiple comments...
		// https://github.com/JoshuaKGoldberg/all-contributors-auto-action/issues/180
		const newComment = await octokit.request(...commentRequestArgs);
		core.debug(`Posted comment ${newComment.data.id} for ${latestId}.`);
	}
}
