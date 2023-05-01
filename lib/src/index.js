import { createAllContributorsForRepository } from "all-contributors-for-repository";
const contributors = await createAllContributorsForRepository({
	auth: undefined,
	owner: undefined,
	repo: undefined,
});
for (const [contributor, contributions] of Object.entries(contributors)) {
	for (const contribution of contributions) {
		// await $`npx all-contributors add ${contributor} ${contribution}`;
		console.log({ contributor, contribution });
	}
}
//# sourceMappingURL=index.js.map
