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

## Version Numbers

A version number gets asked two questions at once: what changed since the last release, and exactly which build is running on a given server. Trying to answer both in one number is what produced the legacy scheme described at the end of this section, which packed the year, the release cycle, the build date, and the build time into four segments. It guaranteed a unique number for every build and told you nothing about compatibility.

The rule for new work separates the two concerns. Use semantic versioning to answer the first question, and let a counter service answer the second.

### Semantic Versioning

Three integer segments, `MAJOR.MINOR.PATCH`, following [Semantic Versioning 2.0.0](https://semver.org/). No fourth segment, no dates, no build timestamps.

- **Major.** A breaking change. Consumers have to do something before they can upgrade.
- **Minor.** New capability, backward compatible. Consumers can upgrade without touching anything.
- **Patch.** A fix or an internal change with no effect on the public surface.

Bumping a segment resets everything to its right. A major bump resets minor and patch to `0`; a minor bump resets patch to `0`.

Below `1.0.0` the surface is still moving and the promise is weaker, so bump the minor for new capability *or* breaking changes, and the patch for fixes. Reaching `1.0.0` is the statement that the surface is stable enough to make the full promise.

### Where the Number Comes From

Deployed applications get their version from the Bump API at build time. The build script asks for a bump and uses whatever comes back:

```
POST https://bump.danielmiller.ca/api/apps/<handle>/version/bumps
Authorization: Bearer <key>
Idempotency-Key: <guid>
Content-Type: application/json

{ "level": "patch" }
```

The response carries the new version. Four things follow from keeping the counter in a service rather than a file in the repo:

- **Uniqueness is free.** Every build gets a number no earlier build has had, which is the property the legacy timestamp scheme existed to provide. Nothing has to encode the clock to get it.
- **The reset rules are applied atomically.** Two builds cannot both read `1.4.0` and both produce `1.4.1`.
- **An unknown handle is created on first use,** seeded to match the level requested: `major` starts at `1.0.0`, `minor` at `0.1.0`, `patch` at `0.0.1`. A new project needs no setup step.
- **A retried build does not burn a number.** The endpoint honours `Idempotency-Key`, so a replayed request returns the version the original call produced.

Build scripts take the level as a parameter and default it to `patch`. See `-BumpLevel` in `cmds-app/platform/build/build.ps1` for the working example. Pass `minor` or `major` when the batch of commits warrants it.

**One number, used everywhere.** The value that comes back is stamped into the assembly with `-p:Version`, into package filenames, and into the deployment release number. The version in configuration and the version in the assembly are the same number reached by two different read paths, and neither may fall back to the other. If deploy-time substitution fails, the About page shows a blank version rather than a plausible wrong one, while the health endpoint still reports what was genuinely built.

**One exception.** `daniel-miller/bump` cannot call itself to build itself, so it derives its own version from `build/version-prefix.txt` plus the git commit count. That is a bootstrap workaround, not a pattern to copy.

### Published Packages

Packages with external consumers are versioned by hand rather than by the counter, because the number is a promise to whoever installs them, not a record of which build shipped. Publishing is tag-driven: the tag carries the version and the workflow packs from it. See `bump/docs/sdk-publishing.md` for the working example.

A published version is permanent. If you tag the wrong commit and it publishes, treat the number as burned and publish the correction as the next patch. Never reuse one.

### Mapping Commit Types to Segments

The commit types above already indicate which segment a change belongs to:

| Commit | Segment |
|--------|---------|
| `feat` | Minor |
| `fix`, `perf` | Patch |
| Any type with `!` and a `BREAKING CHANGE:` footer | Major |
| `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` | Patch, or nothing at all when the change never reaches production |

This guides the choice of level; it does not automate it. One build usually carries several commits, so the highest segment any commit in the batch calls for is the one to request.

### Legacy Schemes

`cmds-app` uses `Major.Minor.Build.Revision`, where major is a two-digit year plus the release cycle number, minor is the four-digit build year, build is `MMDD`, and revision is `HHMM`. So `251.2025.205.2359` is release cycle 1 of 2025, built on February 5. It is documented in `cmds-app/docs/docs/contributors/conventions/version-numbers.md` and stays in place for the codebase already using it. It is not for new work.
