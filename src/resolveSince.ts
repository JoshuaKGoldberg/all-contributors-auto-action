import { getPreviousRunTime } from "./getPreviousRunTime.js";
import { Locator, Octokit } from "./types.js";

const durationMatcher = /^(\d+)\s*([hdw])$/i;

const millisecondsPerUnit = {
	d: 24 * 60 * 60 * 1000,
	h: 60 * 60 * 1000,
	w: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Resolves the `since` input into the earliest time to look for contributions.
 * @returns That time, or undefined to look at all history.
 */
export async function resolveSince(
	input: string,
	octokit: Octokit,
	locator: Locator,
	runId: number,
	now = new Date(),
): Promise<Date | undefined> {
	const trimmed = input.trim();

	switch (trimmed.toLowerCase()) {
		case "":
		case "auto":
			return await getPreviousRunTime(octokit, locator, runId);

		case "all":
			return undefined;
	}

	const duration = durationMatcher.exec(trimmed);
	if (duration) {
		const unit = duration[2].toLowerCase() as keyof typeof millisecondsPerUnit;
		return new Date(
			now.getTime() - Number(duration[1]) * millisecondsPerUnit[unit],
		);
	}

	const date = new Date(trimmed);
	if (Number.isNaN(date.getTime())) {
		throw new Error(
			`Invalid 'since' input: "${input}". Expected 'auto', 'all', an ISO 8601 date, or a duration like '7d' or '12h'.`,
		);
	}

	return date;
}
