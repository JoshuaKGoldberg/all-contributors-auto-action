import * as core from "@actions/core";
import * as github from "@actions/github";
import { createAllContributorsForRepository } from "all-contributors-for-repository";
import { $ } from "execa";

core.debug("About to retrieve contributors...");

const githubToken = process.env.GITHUB_TOKEN;

const contributors = await createAllContributorsForRepository({
	auth: githubToken,
	owner: github.context.repo.owner,
	repo: github.context.repo.repo,
});

core.debug(`Retrieved contributors: ${JSON.stringify(contributors, null, 4)}`);

for (const [contributor, contributions] of Object.entries(contributors)) {
	await $({
		env: { GITHUB_TOKEN: githubToken },
	})`npx -y all-contributors add ${contributor} ${contributions.join(",")}`;
}
