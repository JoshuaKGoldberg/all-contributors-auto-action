import * as core from "@actions/core";

import { dataIsRepoFile } from "./dataIsRepoFile.js";
import { AllContributorsConfig, Locator, Octokit } from "./types.js";

export type ExistingContributions = Record<string, Set<string> | undefined>;

const contributorsConfigFile = ".all-contributorsrc";

export async function getExistingContributors(
	octokit: Octokit,
	locator: Locator
): Promise<ExistingContributions> {
	const { data } = await octokit.request(
		"GET /repos/{owner}/{repo}/contents/{path}",
		{
			...locator,
			path: contributorsConfigFile,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	if (!dataIsRepoFile(data)) {
		throw new Error(
			`${contributorsConfigFile} does not seem to exist as a file in this repository?`
		);
	}

	const contents = Buffer.from(data.content, data.encoding).toString();
	const allContributorsConfig = JSON.parse(contents) as AllContributorsConfig;

	core.debug(
		`Retrieved allcontributors config: ${JSON.stringify(allContributorsConfig)}`
	);

	return Object.fromEntries(
		allContributorsConfig.contributors?.map(
			(contributor) =>
				[contributor.login, new Set(contributor.contributions)] as const
		) ?? []
	);
}
