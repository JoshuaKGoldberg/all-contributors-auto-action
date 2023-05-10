import fs from "node:fs/promises";

import { AllContributorsConfig } from "./types.js";

export type ExistingContributions = Record<string, Set<string> | undefined>;

export async function getExistingContributors(): Promise<ExistingContributions> {
	const allContributorsConfig = JSON.parse(
		(await fs.readFile(".all-contributorsrc")).toString()
	) as AllContributorsConfig;

	return Object.fromEntries(
		allContributorsConfig.contributors?.map(
			(contributor) =>
				[contributor.login, new Set(contributor.contributions)] as const
		) ?? []
	);
}
