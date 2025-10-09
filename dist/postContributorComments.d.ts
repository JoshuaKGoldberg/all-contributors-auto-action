import { ContributorContributions } from "all-contributors-for-repository";
import { ExistingContributions } from "./getExistingContributors.js";
export declare function postContributorComments(contributor: string, contributions: ContributorContributions, existingContributors: ExistingContributions): Promise<void>;
