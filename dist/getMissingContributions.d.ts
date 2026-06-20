import type { ContributorContributions } from "all-contributors-for-repository";
import type { ExistingContributions } from "./getExistingContributors.js";
export declare function getMissingContributions(contributor: string, contributions: ContributorContributions, existingContributors: ExistingContributions): ContributorContributions;
