export type ExistingContributions = Record<string, Set<string> | undefined>;
export declare function getExistingContributors(): Promise<ExistingContributions>;
