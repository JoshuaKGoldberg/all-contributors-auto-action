import {
	blockCTATransitions,
	blockESLint,
	blockNcc,
	blockReleaseIt,
	blockTSDown,
	createConfig,
} from "create-typescript-app";

export default createConfig({
	refinements: {
		blocks: {
			add: [blockCTATransitions, blockNcc],
			exclude: [blockReleaseIt, blockTSDown],
		},
		extensions: [
			blockESLint({
				extensions: [
					{
						files: ["**/*.{js,ts}"],
						rules: [
							{
								comment:
									"These on-by-default rules work well for this repo if configured",
								entries: {
									"@typescript-eslint/restrict-template-expressions": [
										"error",
										{
											allowBoolean: true,
											allowNullish: true,
											allowNumber: true,
										},
									],
								},
							},
						],
					},
				],
			}),
		],
	},
});
