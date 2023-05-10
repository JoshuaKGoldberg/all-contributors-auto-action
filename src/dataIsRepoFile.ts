interface RepoFile {
	content: string;
	encoding: "base64";
	type: "file";
}

export function dataIsRepoFile(data: unknown): data is RepoFile {
	return (
		typeof data === "object" &&
		!!data &&
		"type" in data &&
		data.type === "file" &&
		"content" in data
	);
}
