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

	for (const [type, ids] of Object.entries(missingContributions)) {
		await postContributionComment(contributor, ids[ids.length - 1], type);
	}
}
