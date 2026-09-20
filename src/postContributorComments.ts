import * as core from "@actions/core";
import { ContributorContributions } from "all-contributors-for-repository";

import { ExistingContributions } from "./getExistingContributors.js";
import { getMissingContributions } from "./getMissingContributions.js";
import { postContributionComment } from "./postContributionComment.js";

export async function postContributorComments(
	contributor: string,
	contributions: ContributorContributions,
	existingContributors: ExistingContributions,
) {
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
		return;
	}

	core.debug(
		`${contributor} is missing: ${JSON.stringify(missingContributions)}`,
	);

	// Multiple types may share the same latest issue or PR.
	// Grouping them lets us post a single comment requesting all of them at once.
	const typesByLatestId = new Map<number, string[]>();

	for (const [type, ids] of Object.entries(missingContributions)) {
		const latestId = ids[ids.length - 1];
		const types = typesByLatestId.get(latestId);

		if (types) {
			types.push(type);
		} else {
			typesByLatestId.set(latestId, [type]);
		}
	}

	for (const [latestId, types] of typesByLatestId) {
		await postContributionComment(contributor, latestId, types);
	}
}
