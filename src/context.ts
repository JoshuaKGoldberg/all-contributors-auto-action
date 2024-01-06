import * as github from "@actions/github";

import { Octokit } from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const githubToken = process.env.GITHUB_TOKEN!;

export const { repo: locator } = github.context;
export const octokit: Octokit = github.getOctokit(githubToken);
