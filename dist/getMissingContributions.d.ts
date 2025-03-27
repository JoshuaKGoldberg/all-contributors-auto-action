import { ContributorContributions } from "all-contributors-for-repository";
import { ExistingContributions } from "./getExistingContributors.js";
export declare function getMissingContributions(
	contributor: string,
	contributions: ContributorContributions,
	existingContributors: ExistingContributions,
): ContributorContributions;
