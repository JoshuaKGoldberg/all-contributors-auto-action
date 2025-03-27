import { Locator, Octokit } from "./types.js";
export type ExistingContributions = Record<string, Set<string> | undefined>;
export declare function getExistingContributors(
	octokit: Octokit,
	locator: Locator,
): Promise<ExistingContributions>;
