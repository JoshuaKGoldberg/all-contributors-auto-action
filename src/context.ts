import * as github from "@actions/github";

import { Octokit } from "./types.js";

function getGithubToken() {
	const githubToken = process.env.GITHUB_TOKEN;

	// Octokit would otherwise silently fall back to unauthenticated requests,
	// which fail later with a confusing rate limit error
	if (!githubToken) {
		throw new Error(
			"The GITHUB_TOKEN environment variable must be set. See https://github.com/JoshuaKGoldberg/all-contributors-auto-action#token-and-permissions.",
		);
	}

	return githubToken;
}

export const githubToken = getGithubToken();

export const { repo: locator } = github.context;
export const octokit: Octokit = github.getOctokit(githubToken);
