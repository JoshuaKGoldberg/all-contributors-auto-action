import * as core from "@actions/core";
import { getAllContributorsForRepository } from "all-contributors-for-repository";

import { githubToken, locator, octokit } from "./context.js";
import { getExistingContributors } from "./getExistingContributors.js";
import { postContributorComments } from "./postContributorComments.js";

core.debug("About to retrieve contributors...");

const ignoredLoginsRaw = core.getMultilineInput("ignored-logins");
const ignoredLogins = ignoredLoginsRaw.map(
	(rawInput) => new RegExp(rawInput, "i"),
);

const contributors = await getAllContributorsForRepository({
	auth: githubToken,
	// Don't include at all, if no option was provided, so we fall back to defaults
	...(ignoredLogins.length ? { ignoredLogins } : {}),
	...locator,
});

core.debug(`Retrieved contributors: ${JSON.stringify(contributors)}`);

const existingContributors = await getExistingContributors(octokit, locator);

await Promise.all(
	Object.entries(contributors).map(async ([contributor, contributions]) => {
		await postContributorComments(
			contributor,
			contributions,
			existingContributors,
		);
	}),
);
