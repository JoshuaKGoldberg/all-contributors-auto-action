import * as github from "@actions/github";
import { getGitHubAuthToken } from "get-github-auth-token";

import { Octokit } from "./types.js";

const auth = await getGitHubAuthToken();

if (!auth.succeeded) {
	throw new Error(
		"Could not find a GitHub token. See https://github.com/JoshuaKGoldberg/all-contributors-auto-action#token-and-permissions.",
		{ cause: auth.error },
	);
}

export const githubToken = auth.token;

export const { repo: locator } = github.context;
export const octokit: Octokit = github.getOctokit(githubToken);
