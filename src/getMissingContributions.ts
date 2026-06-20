import type { ContributorContributions } from "all-contributors-for-repository";

import type { ExistingContributions } from "./getExistingContributors.js";

export function getMissingContributions(
	contributor: string,
	contributions: ContributorContributions,
	existingContributors: ExistingContributions,
): ContributorContributions {
	const existingContributions = existingContributors[contributor];
	if (!existingContributions) {
		return contributions;
	}

	return Object.fromEntries(
		Object.entries(contributions)
			.filter(([type]) => !existingContributions.has(type))
			.map(([type, ids]) => [type, Array.from(ids).sort()]),
	);
}
