# Contributing to Expert Market

Thanks for contributing! This guide defines the **Git collaboration protocol** for this repository: how branches, commits, and pull requests are expected to work, plus the content and license rules specific to Expert Market.

> 中文读者请先阅读 [README.zh-CN.md](README.zh-CN.md)；贡献流程规范以本文件为准。

## 1. Git Workflow

- **Branches** — use short, descriptive branch names: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`. Never commit directly to `main`; always open a pull request.
- **Commit messages** — follow the Conventional Commits style:

  ```text
  <type>(<scope>): <short summary>

  <optional body, why the change is made>
  ```

  Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`. Examples:

  ```text
  feat(core): add validation for team dependsOn cycles
  fix(market): handle GitHub API rate-limit errors in catalogue view
  docs: record adaptation sources in github-skill-adaptations.md
  ```

- **Pull requests** — one PR per logical change; keep the diff reviewable. Before opening a PR, make sure the quality gates in §2 pass. The `main` branch is protected by review.

## 2. Quality Gates

Requirements: **Node.js 24+**, **pnpm 9+**.

```bash
pnpm install
pnpm test        # core package tests (Node native TS strip)
pnpm typecheck   # type checks across packages
pnpm build       # builds all packages
```

Do not push failing tests or type errors. If a change is blocked by a known issue, say so in the PR description rather than bypassing the gate.

## 3. Content and License Rules (Important)

Expert Market adapts public GitHub Skills/Agents into `expert/v1` packages. When you adapt or author content, you MUST:

1. Read the actual source files and their license before adapting.
2. Record the source repository, path, **pinned commit**, license, and adaptation method in [`docs/github-skill-adaptations.md`](docs/github-skill-adaptations.md).
3. Only copy or derive prompts from content whose license explicitly permits copying/derivation. Content without a license, or with explicit restrictions, may only be **discovered and linked** in the market — never copied as prompts or marked installable.
4. Use [`skills/expert-authoring/SKILL.md`](skills/expert-authoring/SKILL.md) as the authoring flow and acceptance gates.

## 4. Safety Boundary

Expert packages declare responsibilities (`instructions`, `capabilities`) only. They must **never**:

- contain model keys, API keys, tokens, or credentials;
- declare host permissions such as tools, network policies, or filesystem access;
- execute uploader-provided scripts inside the market process.

Security issues should be reported privately via GitHub Security Advisories rather than in public issues. Do not include secrets in commits, issues, or PRs.

## 5. Getting Started

Open issues and PRs in this repository. For questions about the protocol, see [`docs/architecture.html`](docs/architecture.html) and the two Skills under [`skills/`](skills/).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
