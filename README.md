# Expert Market

> An open-source framework for **experts** and **expert teams** that collaborate by role and dependency.

<div align="center">

[English](README.md) · [简体中文](README.zh-CN.md)

</div>

Expert Market puts two things into a single protocol:

- **An expert** — a declarative package that can complete one class of work.
- **An expert team** — multiple experts that collaborate by role and dependency.

This lets individuals publish experts and lets teams compose reusable workflows.

The current release is a runnable **MVP** focused on validating the core data flow:

```text
Task -> Coordinator Agent decides -> Invoke experts on demand -> Hand off results -> Final integrated output
```

## Features

- **`@expert/core`** — expert manifests, team manifests, an in-memory registry, a coordinated `TeamRunner`, and runtime events.
- **`apps/market`** — a local Expert Market workbench for searching experts, viewing details, drafting teams, and submitting local review entries.
- The workbench is a static server built on Node's standard library with plain HTML/JS — no online npm install needed to boot.
- **GitHub Topic search** — the product calls GitHub's public Repository Search API directly, without a self-hosted backend server.
- `docs/architecture.html` — a draggable architecture flow diagram with annotated data-structure docs (Chinese comments).
- `skills/expert-market-safety/SKILL.md` — general experience for keeping uploaded content isolated from the host executor.
- `skills/expert-authoring/SKILL.md` — the authoring flow, prompt templates, and acceptance gates for converting public GitHub Skills/Agents into `expert/v1`.
- `docs/github-skill-adaptations.md` — GitHub sources, pinned commits, licenses, and adaptation boundaries for the first batch of experts.
- `apps/market/src/catalogue.js` — **36** professional expert prompts, **4** expert teams, and source-audit records (including 12 Unity experts and 2 Unity teams).
- `examples/` — copy-paste-ready expert and team manifest examples.
- `packages/core/src/host-exporter.ts` + `apps/market/scripts/install.mjs` — compile and install experts/teams as `SKILL.md` readable by Codex, DSH, and Claude Code.

## Quick Start

Requirements: **Node.js 24+**, **pnpm 9+**. Core tests use Node's native TypeScript strip; the market server itself runs on Node.js 20+.

```bash
pnpm install
pnpm dev
```

Open <http://127.0.0.1:4173> to see the workbench.

In the workbench, switch the search source to `GitHub Topic`, enter e.g. `agent-skills`, and submit. Results come directly from GitHub; the product only displays them and links through — it never downloads or executes unfamiliar repository code. Anonymous, logged-out GitHub API calls have rate limits. If you need more headroom, proxy it from a backend and use a secure OAuth / GitHub App flow; never hard-code personal tokens in the frontend.

The local catalogue ships with **24 general experts** and **12 Unity experts**: evidence research, architecture, testing, security, delivery, code maintenance, frontend, Unity project architecture, Gameplay, Editor, data, assets, physics/navigation, performance, UI, QA, game design, production, and build & release. They reference publicly licensed GitHub Skills/Agents, but the prompts are rewritten by this project and are not direct installs of the source repos. Every adapted entry shows its source file, pinned commit, and license in the detail panel.

```bash
pnpm test
pnpm build
pnpm typecheck

# List market entries
pnpm expert:install -- --list

# Install the Unity Development team into the current project's Codex
pnpm expert:install -- --host codex --id team.unity-development

# Install the Unity Game Production team into DSH global Skills
pnpm expert:install -- --host dsh --id team.unity-game-production --scope global

# Install a single Unity expert into a Claude Code project directory
pnpm expert:install -- --host claude-code --id expert.unity-project-architect
```

The installer supports three hosts: `codex`, `dsh`, `claude-code`. Project-scoped installs write to `.codex/skills`, `.dsh/skills`, or `.claude/skills` in the current project; `--scope global` writes to the matching location under your home directory; `--dest` lets you point at an explicit Skill root. An existing `SKILL.md` is **not** overwritten by default — updates require an explicit `--force`. The browser workbench only copies commands; it never silently modifies local files.

`team.unity-development` targets concrete development tasks with candidate roles including architecture, Gameplay, Editor, data, assets, physics/navigation, performance, and QA; each run has the Coordinator Agent decide which roles are actually needed, and an integration role closes the loop. `team.unity-game-production` targets end-to-end production from concept to release with candidate roles including production coordination, game design, technical architecture, content/assets, performance, QA, and build & release. A team Skill embeds member prompts and the coordination protocol into a single `SKILL.md`, so Codex, DSH, and Claude Code can collaborate on the same JSON protocol. When the host provides `TeamCoordinator` and `ExpertExecutor`, `TeamRunner` from `@expert/core` validates dispatch decisions, runs per-round calls in parallel, and records both real invocations and skips.

> Note: a team's `steps` are **not** a checklist that must run every time — they are the candidate graph and safety boundary a coordinator may choose from. `dependsOn` only constrains steps that have not yet closed; it cannot be bypassed by the coordinator. Skipped members produce no result, and downstream members that still work must explicitly handle the gap. When no coordinator is provided, the runner keeps the legacy all-dependencies execution behavior for compatibility.

## Expert Package Protocol

Expert packages only describe responsibilities. They carry no model keys and never execute uploader code inside the market process:

```json
{
  "apiVersion": "expert/v1",
  "kind": "expert",
  "metadata": {
    "id": "expert.evidence-researcher",
    "name": "Research Scout",
    "version": "1.2.0",
    "description": "把问题拆成可验证的研究路径",
    "author": "Open Atlas",
    "tags": ["研究", "证据"]
  },
  "spec": {
    "instructions": "先定义问题边界，再收集可追溯证据。",
    "capabilities": ["问题拆解", "证据整理"]
  }
}
```

### Adapting from GitHub Skills

A `SKILL.md` on GitHub is a common open format, but it is **not** our runtime protocol. When adapting, you must first read the actual files and license, then distill responsibilities, boundaries, inputs, outputs, and failure handling, and finally produce `expert/v1`. Scripts, MCP servers, network access, filesystem access, and credential dependencies in the source repo do **not** automatically gain host permissions just because they appear in a `SKILL.md`.

To author new experts, use `skills/expert-authoring/SKILL.md` and record the repo, path, pinned commit, license, and adaptation method in `docs/github-skill-adaptations.md`. Content without a license, or with explicit copy/derivation restrictions, may only be discovered and linked in the market — it must never be copied as prompts or flagged as installable.

## Expert Team Protocol

Expert teams declare candidate roles, hand-off boundaries, and safety dependencies through member IDs and `dependsOn`. At runtime the Coordinator Agent decides each round which experts are needed, what subtasks each expert owns, and when to call them. Candidates without dependencies may run in parallel in the same round; the next round must wait for the current round's results before re-planning.

```json
{
  "apiVersion": "expert/v1",
  "kind": "team",
  "metadata": {
    "id": "team.product-brief",
    "name": "Product Brief Team",
    "version": "1.0.0",
    "description": "研究、审查、编辑三段协作",
    "author": "Open Atlas",
    "tags": ["产品", "协作"]
  },
  "spec": {
    "members": [
      { "id": "scout", "expert": "expert.evidence-researcher", "role": "研究员" },
      { "id": "critic", "expert": "expert.evidence-critic", "role": "审查员" },
      { "id": "editor", "expert": "expert.decision-editor", "role": "主编" }
    ],
    "steps": [
      { "member": "scout" },
      { "member": "critic", "dependsOn": ["scout"] },
      { "member": "editor", "dependsOn": ["critic"] }
    ]
  }
}
```

Each round the Coordinator Agent returns only a structured decision:

```json
{
  "calls": [
    { "member": "scout", "task": "确认问题边界并收集可追溯证据" }
  ],
  "skipMembers": ["critic"],
  "rationale": "当前任务只需要先建立事实，不涉及争议结论"
}
```

The runner rejects unknown members, duplicate decisions, calls that violate `dependsOn`, and attempts to skip the final integration step. `skipMembers` means permanently skipped for this task, not deferred. `completed` contains only real execution results; `skipped` separately records members with no result. Each round the coordinator should review the original task, candidate responsibilities, completed results, dispatched members, skipped members, and currently available members before planning the next round.

The minimal host integration shape:

```ts
const result = await runner.run(teamId, task, {
  coordinator: async (input) => coordinatorModel(input),
});
```

`coordinatorModel` parses the host model's structured output into `calls / skipMembers / rationale`. Model, tools, keys, network, and filesystem permissions are still injected by the host's `ExpertExecutor`. A generated `SKILL.md` is only a cross-host compatibility protocol — it never launches sub-agents on its own or grants permissions.

## Safety Boundary

Uploading and running must be handled separately. In the MVP, the host executor is registered by the application, and expert packages provide only declarative `instructions` and `capabilities`. Before onboarding third-party experts in production, you still need signature validation, version pinning, permission declarations, resource quotas, network & filesystem sandboxing, audit logging, and human review. Until those boundaries exist, you should not execute arbitrary uploader JavaScript/Python.

## Design Decisions

**Facts and constraints**

- The repository starts from scratch — no legacy backend, account system, or remote registry yet.
- Users need three primary paths: single experts, an expert market, and custom expert teams.
- The core of an expert team is not one more config page — it is role division, dependencies, hand-off, and observable runtime.

**Choices**

- Implement the declarative protocol and local runtime first, then a cloud market. Market API, login, payments, review backend, and arbitrary-code sandboxing belong to later boundaries and are intentionally kept out of the first core model.
- The last step declared in a team's `steps` is treated as the final output, avoiding nondeterministic results from parallel completion ordering.

**Parameter/field reduction review**

- Keep `metadata` — used for discovery, versioning, and attribution; its lifecycle persists with the expert package.
- Keep `spec.instructions` and `spec.capabilities` — they express behavioral constraints and searchable capabilities respectively; one field cannot reliably derive the other.
- Keep `members` and `steps` — members answer "who participates, in which role, as a candidate", steps answer "what hand-offs are allowed and who depends on whom"; actual participation is decided at runtime.
- Keep `TeamCoordinator`'s runtime input and `TeamDispatchPlan` — they answer "what the coordinator sees" and "what this round dispatches"; task-level choices must not be hard-coded into a package.
- Keep `skipped` — skipped members have no result and must be distinguished from real completions; removing it would leave downstream unable to detect gaps.
- Drop a separate `handoff` state — hand-off content reuses completed step results, avoiding extra synchronized state.
- Drop a team-level `finalMember` — default to the last declared step, one less config field to maintain, and deterministic results.
- Drop model, key, and tool-permission configuration — they belong to the host executor and runtime environment, not to public expert packages.

## Roadmap

1. **Registry** — Git repository indexing, version pinning, signing, and review status.
2. **Runtime** — host adapters, tool permissions, streaming events, and task cancellation.
3. **Team Studio** — drag-and-drop orchestration, parallel branches, failure retry, and human approval nodes.
4. **Marketplace** — accounts, publish review, ratings, dependency scanning, and install lockfiles.
5. **Sandbox** — WASI, containers, or process-level isolation depending on host capability (isolation is not assumed to be a frontend feature).

## Contributing

Contributions, bug reports, and ideas are welcome. Please open an issue or pull request in this repository. Before adapting third-party content, make sure its license permits copying/derivation, and record the source, path, pinned commit, and license in `docs/github-skill-adaptations.md`.

## License

[MIT](LICENSE)