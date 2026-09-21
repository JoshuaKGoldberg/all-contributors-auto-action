import * as core from "@actions/core";

import { Locator, Octokit } from "./types.js";

/**
 * Finds when the workflow's most recent successful run before this one started.
 * @returns That time, or undefined if it couldn't be determined.
 */
export async function getPreviousRunTime(
	octokit: Octokit,
	locator: Locator,
	runId: number,
): Promise<Date | undefined> {
	try {
		const {
			data: { workflow_id: workflowId },
		} = await octokit.request(
			"GET /repos/{owner}/{repo}/actions/runs/{run_id}",
			{
				...locator,
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
				run_id: runId,
			},
		);

		const {
			data: { workflow_runs: previousRuns },
		} = await octokit.request(
			"GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
			{
				...locator,
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
				per_page: 1,
				status: "success",
				workflow_id: workflowId,
			},
		);

		const previousRun = previousRuns.at(0);
		if (!previousRun) {
			core.info("No previous successful run found; looking at all history.");
			return undefined;
		}

		core.info(
			`Previous successful run ${previousRun.id} started at ${previousRun.created_at}.`,
		);
		return new Date(previousRun.created_at);
	} catch (error) {
		core.info(
			`Could not determine the previous run (does the job have 'actions: read' permission?); looking at all history: ${String(error)}`,
		);
		return undefined;
	}
}
