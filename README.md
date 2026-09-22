<h1 align="center">All Contributors Auto Action</h1>

<p align="center">
	Fills in missing allcontributors entries for a repository.
	👪
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 5" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-5-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/all-contributors-auto-action" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/all-contributors-auto-action?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

This action will:

1. Ask [`all-contributors-for-repository`](https://github.com/JoshuaKGoldberg/all-contributors-for-repository) to collect the current repository's contributors
2. Post [`@all-contributors add` bot comments](https://allcontributors.org/docs/en/bot/usage) in the newest issues and PRs for each contributor

> **Warning**
> This tool only sees contributions that can be detected from the last 500 events in GitHub's API.
> Don't forget to manually add in other forms of contributions!

For example, the following job will run on every push to `main`:

```yml
# .github/workflows/contributors.yml
name: Contributors

on:
  push:
    branches:
      - main

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  contributors:
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/all-contributors-auto-action@v0.7.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

...and will post comments like the following automatically:

> @all-contributors please add JoshuaKGoldberg for code.
>
> > 🤖 Beep boop! This comment was added automatically by [all-contributors-auto-action](https://github.com/marketplace/actions/all-contributors-auto-action).
> >
> > Not all contributions can be detected from Git & GitHub alone.
> > Please comment any missing contribution types this bot missed.
> >
> > ...and of course, thank you for contributing! 💙

### Token and Permissions

The action reads its GitHub token from the `GH_TOKEN` or `GITHUB_TOKEN` environment variable.
See [get-github-auth-token](https://github.com/JoshuaKGoldberg/get-github-auth-token) for more details.
It uses that token to:

- Read the repository's issues, pull requests, commits, and events to detect contributions
- Read the repository's `.all-contributorsrc` file to see which contributors are already recorded
- Post `@all-contributors` comments on issues and pull requests

The workflow's built-in [`secrets.GITHUB_TOKEN`](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication) works as long as the job is granted these permissions:

```yml
permissions:
  contents: read
  issues: write
  pull-requests: write
```

Alternately, you can use a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) stored as a repository secret.
Grant it these repository permissions:

- **Contents**: Read-only
- **Issues**: Read and write
- **Pull requests**: Read and write
- **Metadata**: Read-only _(selected automatically)_

A classic personal access token needs the `public_repo` scope for public repositories, or the `repo` scope for private repositories.

Then pass it to the action instead of `secrets.GITHUB_TOKEN`:

```yml
- uses: JoshuaKGoldberg/all-contributors-auto-action@v0.7.0
  env:
    GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
```

### Inputs

#### `ignored-logins`

RegExp patterns to use for omitting sets of logins (e.g. dependabot).
The action will not attempt to add these users as contributors.
Powered by `all-contributors-for-repository`, which comes with its own set of reasonable defaults (e.g. `\[bot\]$`).
All patterns will be used to create `RegExp` with case-insensitive matching.

```yml
# .github/workflows/contributors.yml
name: Contributors

on:
  push:
    branches:
      - main

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  contributors:
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/all-contributors-auto-action@v0.7.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          ignored-logins: |
            -admin$
            -it$
```

#### `since`

How far back to look for contributions.
Defaults to `auto`.

- `auto`: Look back to when the workflow's previous successful run started, so repeated runs don't re-request contributions they've already seen.
  This requires the job to have the `actions: read` permission.
  If there is no previous successful run, or it can't be determined, all available history is used.
- `all`: Look at all available history.
- An ISO 8601 date, such as `2026-01-01`, or a duration such as `12h`, `7d`, or `2w`.

Only the contributions made since that time are requested from GitHub.
This makes each run faster and cheaper in API requests, especially on busy repositories.

A contributor's older contributions won't be seen by a windowed run, though.
To also catch anything a windowed run missed, consider running a full scan on a schedule alongside the windowed runs:

```yml
# .github/workflows/contributors.yml
name: Contributors

on:
  push:
    branches:
      - main
  schedule:
    - cron: "0 0 * * 0"

permissions:
  actions: read
  contents: read
  issues: write
  pull-requests: write

jobs:
  contributors:
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/all-contributors-auto-action@v0.7.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          since: ${{ github.event_name == 'schedule' && 'all' || 'auto' }}
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 👪

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.fdlpm.com"><img src="https://avatars.githubusercontent.com/u/9667945?v=4?s=100" width="100px;" alt="Fabian De La Peña Montero"/><br /><sub><b>Fabian De La Peña Montero</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/commits?author=fdlpm" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://johnnyreilly.com/"><img src="https://avatars.githubusercontent.com/u/1010525?v=4?s=100" width="100px;" alt="John Reilly"/><br /><sub><b>John Reilly</b></sub></a><br /><a href="#ideas-johnnyreilly" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/commits?author=JoshuaKGoldberg" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/doudou0720"><img src="https://avatars.githubusercontent.com/u/98651603?v=4?s=100" width="100px;" alt="doudou0720"/><br /><sub><b>doudou0720</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/issues?q=author%3Adoudou0720" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/michaelfaith"><img src="https://avatars.githubusercontent.com/u/8071845?v=4?s=100" width="100px;" alt="michael faith"/><br /><sub><b>michael faith</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/all-contributors-auto-action/issues?q=author%3Amichaelfaith" title="Bug reports">🐛</a> <a href="#ideas-michaelfaith" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
