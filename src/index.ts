import * as core from "@actions/core";
import * as github from "@actions/github";
import { createAllContributorsForRepository } from "all-contributors-for-repository";

import { commentDisclaimer, commentPrefix } from "./comments.js";
import { doesPullAlreadyHaveComment } from "./doesPullAlreadyHaveComment.js";
import { getExistingContributors } from "./getExistingContributors.js";
import { getMissingContributions } from "./getMissingContributions.js";

core.debug("About to retrieve contributors...");

const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) {
	throw new Error("Missing process.env.GITHUB_TOKEN :(");
}

const { owner, repo } = github.context.repo;

const contributors = await createAllContributorsForRepository({
	auth: githubToken,
	owner,
	repo,
});

core.debug(`Retrieved contributors: ${stringify(contributors)}`);

const existingContributors = await getExistingContributors();

const octokit = github.getOctokit(githubToken);

for (const [contributor, contributions] of Object.entries(contributors)) {
	core.debug(
		`Retrieving missing contributions for contributor: ${contributor}`
	);

	const missingContributions = getMissingContributions(
		contributor,
		contributions,
		existingContributors
	);
	if (!Object.keys(missingContributions).length) {
		core.debug(`${contributor} is not missing any contributions.`);
		continue;
	}

	core.debug(`${contributor} is missing: ${stringify(missingContributions)}`);

	for (const [type, ids] of Object.entries(missingContributions)) {
		const latestId = ids[ids.length - 1];

		core.debug(`Checking for existing ${contributor} comment: ${latestId}`);

		const existingComment = await doesPullAlreadyHaveComment(
			octokit,
			{ owner, repo },
			latestId
		);
		if (existingComment) {
			core.debug(`${latestId} already has a comment: ${existingComment.id}`);
			continue;
		}

		core.debug(
			`${latestId} doesn't already have a comment; posting a new one.`
		);

		// TODO: It'd be nice to deduplicate these comments.
		// PRs that include multiple types will cause multiple comments...
		const newComment = await octokit.request(
			"POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
			{
				owner,
				repo,
				issue_number: latestId,
				body: [
					`${commentPrefix} ${contributor} for ${type}.`,
					commentDisclaimer,
				].join("\n\n"),
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
			}
		);

		core.debug(`Posted comment ${newComment.data.id} for ${latestId}.`);
	}
}

function stringify(value: unknown) {
	return JSON.stringify(value, null, 4);
}
