import type * as github from "@actions/github";
/**
 * Note: this is only a partial description of config data.
 */
export interface AllContributorsConfig {
    contributors?: Contributor[];
}
interface Contributor {
    contributions: string[];
    login: string;
}
export interface Locator {
    owner: string;
    repo: string;
}
export type Octokit = ReturnType<typeof github.getOctokit>;
export {};
