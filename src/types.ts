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
