# Contributing

This repository is my personal career portfolio. Outside contributions aren't expected, but the conventions below keep my own working history tidy and consistent — and serve as a reference if I ever invite collaboration.

In addition, this document establishes the conventions I follow by default in all of the projects to which I contribute (when no other conventions are defined).

## Commit Messages

This repository uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

### Format

```
<type>(<scope>): <description>

<body>

<footer>
```

### Rules

- **Type** — lowercase, from the list below.
- **Scope** — optional, lowercase, parenthesised (e.g. `feat(auth):`).
- **Description** — lowercase, imperative mood ("add" not "added" or "adds"), no trailing period, ~50 characters max.
- **Body** — optional. Wrap at ~72 characters. Separate from the subject with a blank line. Explain *why*, not *what*.
- **Footer** — optional. Used for breaking changes and issue references.

### Types

| Type | Use for |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system or dependencies (NuGet, `.csproj`, Astro config, etc.) |
| `ci` | CI configuration |
| `chore` | Maintenance with no production impact |
| `revert` | Reverts a previous commit |

### `ci:` vs `build:` vs `chore:`

A boundary worth knowing, because it trips people up:

- `ci:` — changes to CI/CD pipeline files (e.g. `.github/workflows/*.yml`, `azure-pipelines.yml`).
- `build:` — changes to the build system itself or its dependencies (e.g. `package.json`, `astro.config.mjs`, NuGet/`.csproj`, build scripts).
- `chore:` — maintenance with no impact on production output (e.g. `.gitignore`, editor config, repo metadata).

So `bump astro to 5.2` is `build:` (it's a build dependency), but `bump actions/checkout to v4` is `ci:` (it's only used inside a workflow).

### Breaking Changes

Append `!` after the type/scope and include a `BREAKING CHANGE:` footer.

For example:

```
feat(api)!: drop support for legacy auth tokens

BREAKING CHANGE: legacy bearer tokens issued before v2 are no longer
accepted. Clients must re-authenticate via OAuth.
```

### First Commits

The first commit of a new repository follows the same conventions as every other commit, including imperative mood. Prefer a descriptive verb over the traditional but noun-phrased `initial commit`.

Good:

```
chore: bootstrap portfolio
chore: initialize repository
```

Bad:

```
chore: initial commit       # noun phrase, not imperative
chore: first commit         # same problem
Initial commit              # GitHub's default — no type prefix
```

### When to Include a Body

Skip the body when the subject line is fully self-explanatory.

For example:

```
docs: update engagement interests
```

Include a body when the *why* isn't obvious from the *what*.

For example:

```
refactor: extract retry logic into RetryPolicy

The inline retry blocks in SyncService and ImportService had drifted
apart, making it unclear which was authoritative. Consolidating into
RetryPolicy gives them a single source of truth and makes the back-off
curve testable.
```

### Atomic Commits

One logical change per commit. If you can't pick a single type, the commit is doing too much - split it.

### Examples

Good:

```
chore: bootstrap repo
feat: add filter for engagement type
fix: correct broken link to LinkedIn profile
docs: update engagement interests
build: bump astro to 5.2
refactor(auth): simplify token expiry check
```

Bad:

```
Updated readme              # missing type, past tense, capitalized
feat: Added new feature.    # capitalized, past tense, trailing period, vague
fix: stuff                  # uninformative description
WIP                         # not a commit message
```

### References

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- Tim Pope, [*A Note About Git Commit Messages*](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
