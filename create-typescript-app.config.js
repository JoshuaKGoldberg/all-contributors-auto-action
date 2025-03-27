import {
	blockCTATransitions,
	blockESLint,
	blockNcc,
	blockTSup,
	createConfig,
} from "create-typescript-app";

export default createConfig({
	refinements: {
		addons: [
			blockESLint({
				rules: [
					{
						comment:
							"These on-by-default rules work well for this repo if configured",
						entries: {
							"@typescript-eslint/restrict-template-expressions": [
								"error",
								{ allowBoolean: true, allowNullish: true, allowNumber: true },
							],
						},
					},
				],
			}),
		],
		blocks: {
			add: [blockCTATransitions, blockNcc],
			exclude: [blockTSup],
		},
	},
});
