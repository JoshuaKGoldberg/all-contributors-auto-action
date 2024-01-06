import * as core from "@actions/core";
import * as github from "@actions/github";
import { getAllContributorsForRepository } from "all-contributors-for-repository";

import { commentDisclaimer, commentPrefix } from "./comments.js";
import { doesPullAlreadyHaveComment } from "./doesPullAlreadyHaveComment.js";
import { getExistingContributors } from "./getExistingContributors.js";
import { getMissingContributions } from "./getMissingContributions.js";

core.debug("About to retrieve contributors...");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const githubToken = process.env.GITHUB_TOKEN!;

const { repo: locator } = github.context;
const octokit = github.getOctokit(githubToken);

const contributors = await getAllContributorsForRepository({
	auth: githubToken,
	...locator,
});

core.debug(`Retrieved contributors: ${JSON.stringify(contributors)}`);

const existingContributors = await getExistingContributors(octokit, locator);

for (const [contributor, contributions] of Object.entries(contributors)) {
	core.debug(
		`Retrieving missing contributions for contributor: ${contributor}`,
	);

	const missingContributions = getMissingContributions(
		contributor,
		contributions,
		existingContributors,
	);
	if (!Object.keys(missingContributions).length) {
		core.debug(`${contributor} is not missing any contributions.`);
		continue;
	}

	core.debug(
		`${contributor} is missing: ${JSON.stringify(missingContributions)}`,
	);

	for (const [type, ids] of Object.entries(missingContributions)) {
		const latestId = ids[ids.length - 1];

		core.debug(`Checking for existing ${contributor} comment: ${latestId}`);

		const existingComment = await doesPullAlreadyHaveComment(
			octokit,
			locator,
			latestId,
		);
		if (existingComment) {
			core.debug(`${latestId} already has a comment: ${existingComment.id}`);
			continue;
		}

		core.debug(
			`${latestId} doesn't already have a comment; posting a new one.`,
		);

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
}
