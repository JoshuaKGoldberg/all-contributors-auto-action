import * as core from "@actions/core";
import * as github from "@actions/github";
import { getAllContributorsForRepository } from "all-contributors-for-repository";

import { githubToken, locator, octokit } from "./context.js";
import { getExistingContributors } from "./getExistingContributors.js";
import { postContributorComments } from "./postContributorComments.js";
import { resolveSince } from "./resolveSince.js";

core.debug("About to retrieve contributors...");

const ignoredLoginsRaw = core.getMultilineInput("ignored-logins");
const ignoredLogins = ignoredLoginsRaw.map(
	(rawInput) => new RegExp(rawInput, "i"),
);

const since = await resolveSince(
	core.getInput("since"),
	octokit,
	locator,
	github.context.runId,
);

core.debug(
	`Looking for contributions since: ${since?.toISOString() ?? "(all history)"}`,
);

const contributors = await getAllContributorsForRepository({
	auth: githubToken,
	// Don't include at all, if no option was provided, so we fall back to defaults
	...(ignoredLogins.length ? { ignoredLogins } : {}),
	since,
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
