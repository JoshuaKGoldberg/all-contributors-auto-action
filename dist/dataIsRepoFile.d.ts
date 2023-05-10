interface RepoFile {
	content: string;
	encoding: "base64";
	type: "file";
}
export declare function dataIsRepoFile(data: unknown): data is RepoFile;
export {};
