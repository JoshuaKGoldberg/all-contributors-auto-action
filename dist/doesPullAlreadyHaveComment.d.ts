import { Locator, Octokit } from "./types.js";
export declare function doesPullAlreadyHaveComment(
	octokit: Octokit,
	locator: Locator,
	id: number,
): Promise<
	| {
			id: number;
			node_id: string;
			url: string;
			body?: string;
			body_text?: string;
			body_html?: string;
			html_url: string;
			user: {
				name?: string | null;
				email?: string | null;
				login: string;
				id: number;
				node_id: string;
				avatar_url: string;
				gravatar_id: string | null;
				url: string;
				html_url: string;
				followers_url: string;
				following_url: string;
				gists_url: string;
				starred_url: string;
				subscriptions_url: string;
				organizations_url: string;
				repos_url: string;
				events_url: string;
				received_events_url: string;
				type: string;
				site_admin: boolean;
				starred_at?: string;
				user_view_type?: string;
			} | null;
			created_at: string;
			updated_at: string;
			issue_url: string;
			author_association:
				| "COLLABORATOR"
				| "CONTRIBUTOR"
				| "FIRST_TIMER"
				| "FIRST_TIME_CONTRIBUTOR"
				| "MANNEQUIN"
				| "MEMBER"
				| "NONE"
				| "OWNER";
			performed_via_github_app?: {
				id: number;
				slug?: string;
				node_id: string;
				client_id?: string;
				owner:
					| {
							name?: string | null;
							email?: string | null;
							login: string;
							id: number;
							node_id: string;
							avatar_url: string;
							gravatar_id: string | null;
							url: string;
							html_url: string;
							followers_url: string;
							following_url: string;
							gists_url: string;
							starred_url: string;
							subscriptions_url: string;
							organizations_url: string;
							repos_url: string;
							events_url: string;
							received_events_url: string;
							type: string;
							site_admin: boolean;
							starred_at?: string;
							user_view_type?: string;
					  }
					| {
							description?: string | null;
							html_url: string;
							website_url?: string | null;
							id: number;
							node_id: string;
							name: string;
							slug: string;
							created_at: string | null;
							updated_at: string | null;
							avatar_url: string;
					  };
				name: string;
				description: string | null;
				external_url: string;
				html_url: string;
				created_at: string;
				updated_at: string;
				permissions: {
					issues?: string;
					checks?: string;
					metadata?: string;
					contents?: string;
					deployments?: string;
					[key: string]: string | undefined;
				};
				events: string[];
				installations_count?: number;
				client_secret?: string;
				webhook_secret?: string | null;
				pem?: string;
			} | null;
			reactions?: {
				url: string;
				total_count: number;
				"+1": number;
				"-1": number;
				laugh: number;
				confused: number;
				heart: number;
				hooray: number;
				eyes: number;
				rocket: number;
			};
	  }
	| undefined
>;
