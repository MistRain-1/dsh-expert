# Expert Market（专家市场）

> 面向开源生态的「专家」与「专家团」编排框架：专家按角色与依赖协作。

<div align="center">

[English](README.md) · [简体中文](README.zh-CN.md)

</div>

Expert Market 把“单个能完成一类工作的专家”与“多个专家按角色和依赖协作的专家团”放在同一个协议里，让个人可以发布专家，让团队可以组合工作流。

当前版本是可运行的 MVP，重点验证核心数据流：

```text
任务 -> 统筹 Agent 判断 -> 按需调用专家 -> 结果交接 -> 最终集成输出
```

## 当前能力

- `@expert/core`：专家声明、专家团声明、注册表、统筹调度运行器和运行事件。
- `apps/market`：本地专家市场工作台，可搜索、查看详情、创建待配置专家团、提交本地审核条目。
- 市场工作台使用 Node 标准库静态服务和原生 HTML/JS，不依赖在线 npm 安装即可启动。
- GitHub Topic：产品可直接调用 GitHub 公共 Repository Search API 搜索 Topic，不经过本项目自建服务器。
- `docs/architecture.html`：可拖动的架构流程图和带中文注释的数据结构说明。
- `skills/expert-market-safety/SKILL.md`：上传内容与宿主执行器隔离的通用经验。
- `skills/expert-authoring/SKILL.md`：把公开 GitHub Skill/Agent 转成 `expert/v1` 的制作流程、提示词模板和验收门禁。
- `docs/github-skill-adaptations.md`：首批适配专家的 GitHub 来源、固定 commit、许可证和适配边界。
- `apps/market/src/catalogue.js`：36 个专业专家提示词、4 个专家团和来源审计记录，其中包含 12 个 Unity 专家和 2 个 Unity 专家团。
- `examples/`：可直接复制的专家和专家团 manifest 示例。
- `packages/core/src/host-exporter.ts` 与 `apps/market/scripts/install.mjs`：把专家或专家团编译并安装为 Codex、DSH、Claude Code 可读取的 `SKILL.md`。

## 快速开始

环境要求：Node.js 24+、pnpm 9+。核心包测试使用 Node 原生 TypeScript strip，市场服务器本身可运行在 Node.js 20+。

```bash
pnpm install
pnpm dev
```

打开 `http://127.0.0.1:4173` 查看市场工作台。

在工作台的搜索来源中切换到 `GitHub Topic`，输入例如 `agent-skills` 后提交。结果直接来自 GitHub，产品只做展示和跳转，不会下载或执行陌生仓库代码。未登录 GitHub 的公共 API 有请求额度限制；如果需要更高额度，应在后端代理并使用安全的 OAuth 或 GitHub App 认证，不要把个人 Token 写进前端。

本地目录已经加入 24 个通用专家和 12 个 Unity 专家：证据研究、架构、测试、安全、交付、代码维护、前端和 Unity 项目架构、Gameplay、Editor、数据、资产、物理/导航、性能、UI、QA、游戏设计、制作和构建发布。它们参考了许可证清晰的公开 GitHub Skill/Agent，但提示词由本项目重新编写，不等于直接安装来源仓库。每个适配条目在详情面板中显示来源文件、固定 commit 和许可证。

```bash
pnpm test
pnpm build
pnpm typecheck

# 查看市场条目
pnpm expert:install -- --list

# 安装 Unity 开发专家团到当前项目的 Codex
pnpm expert:install -- --host codex --id team.unity-development

# 安装 Unity 整体制作专家团到 DSH 全局 Skills
pnpm expert:install -- --host dsh --id team.unity-game-production --scope global

# 安装单个 Unity 专家到 Claude Code 项目目录
pnpm expert:install -- --host claude-code --id expert.unity-project-architect
```

安装器支持 `codex`、`dsh`、`claude-code` 三个宿主。项目级默认写入当前项目的 `.codex/skills`、`.dsh/skills` 或 `.claude/skills`；`--scope global` 写入用户主目录对应位置；`--dest` 可显式指定 Skill 根目录。已有同名 `SKILL.md` 默认拒绝覆盖，更新时必须显式加 `--force`。浏览器市场只复制命令，不会静默修改本地文件。

`team.unity-development` 面向具体开发任务，候选角色包括架构、Gameplay、Editor、数据、资产、物理/导航、性能和 QA；每次任务由统筹 Agent 判断实际需要哪些角色，最后由集成角色收口。`team.unity-game-production` 面向从创意到发布的整体制作，候选角色包括制作统筹、游戏设计、技术架构、内容资产、性能、QA 和构建发布。团队 Skill 会把成员提示词和统筹协议内嵌到一个 `SKILL.md`，因此 Codex、DSH、Claude Code 可以按同一套 JSON 协议协作；`@expert/core` 的 `TeamRunner` 在宿主提供 `TeamCoordinator` 与 `ExpertExecutor` 时，会校验调度决定、按轮次并行调用，并记录实际调用与跳过结果。

> 注意：团队的 `steps` 不是“每次都必须执行的清单”，而是统筹 Agent 可以选择的候选图和安全边界：`dependsOn` 只约束尚未收口的前置步骤，不能被统筹 Agent 越权绕过；跳过的成员不产生结果，下游如果仍可工作，必须显式处理缺口。没有提供统筹 Agent 时，运行器保留旧的全量依赖执行兼容行为。

## 专家包协议

专家包只描述职责，不携带模型密钥，也不在市场进程里执行上传者代码：

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

### 从 GitHub Skill 适配

GitHub 上的 `SKILL.md` 是一种常见的开放格式，但不是我们的运行协议。适配时必须先读取实际文件和许可证，再提炼职责、边界、输入、输出和失败处理，最后生成 `expert/v1`。来源仓库中的脚本、MCP、网络、文件系统和凭据依赖不会因为被写进 `SKILL.md` 就自动获得宿主权限。

制作新专家时使用 `skills/expert-authoring/SKILL.md`，并按 `docs/github-skill-adaptations.md` 记录仓库、路径、固定 commit、许可证和适配方式。没有许可证或明确限制复制/派生的内容，只能在市场里发现和跳转，不能复制提示词或标记为可安装。

## 专家团协议

专家团通过成员 ID 和 `dependsOn` 声明候选角色、交接边界和安全依赖。真正运行时由统筹 Agent 每轮决定需要哪些专家、每个专家负责什么子任务，以及何时调用。没有依赖的候选可以在同一轮并行；下一轮必须等待本轮结果后重新判断。

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

统筹 Agent 每轮只返回下面的结构化决定：

```json
{
  "calls": [
    { "member": "scout", "task": "确认问题边界并收集可追溯证据" }
  ],
  "skipMembers": ["critic"],
  "rationale": "当前任务只需要先建立事实，不涉及争议结论"
}
```

运行器会拒绝不存在的成员、重复决定、未满足 `dependsOn` 的调用和跳过最终集成步骤。`skipMembers` 是本次任务永久跳过，不是延迟；`completed` 只包含真实执行结果，`skipped` 单独记录没有结果的成员。统筹 Agent 应在每轮查看原始任务、候选职责、已完成结果、已调用成员、已跳过成员和当前可调用成员，再生成下一轮计划。

宿主接入核心运行器的最小形状如下：

```ts
const result = await runner.run(teamId, task, {
  coordinator: async (input) => coordinatorModel(input),
});
```

其中 `coordinatorModel` 负责把宿主模型的结构化输出解析成 `calls / skipMembers / rationale`；模型、工具、密钥、网络和文件系统权限仍由宿主的 `ExpertExecutor` 注入。安装生成的 `SKILL.md` 只是跨宿主兼容协议，不会自行启动子 Agent 或授予权限。

## 安全边界

市场上传和运行必须拆开处理。MVP 的宿主执行器由应用注册，专家包只提供声明式 instructions 与 capabilities。生产环境接入第三方专家时，还需要补齐签名校验、版本锁定、权限声明、资源配额、网络与文件系统沙箱、审计日志和人工审核；在这些边界完成前，不应执行上传者任意 JavaScript/Python。

## 方案取舍

### 事实与约束

- 当前仓库从零开始，没有既有后端、账号系统或远端 Registry。
- 用户需要单专家、专家市场和可自定义专家团三条主链路。
- 专家团的核心不是多一个配置页面，而是角色分工、依赖、交接和可观测运行过程。

### 选择

先实现声明式协议和本地运行时，再接云端市场。市场 API、登录、支付、审核后台和任意代码沙箱都属于后续边界，不塞进第一版的核心模型。专家团 `steps` 中声明的最后一个步骤作为最终输出，避免并行完成时序造成不确定结果。

### 参数/变量削减审查

- 保留 `metadata`：用于发现、版本和归属，生命周期随专家包持久化。
- 保留 `spec.instructions` 与 `spec.capabilities`：分别表达行为约束和可检索能力，不能由同一字段可靠推导。
- 保留 `members` 与 `steps`：成员负责“谁以什么角色作为候选参与”，步骤负责“允许怎样交接以及依赖谁”，实际是否参与由运行时统筹决定。
- 保留 `TeamCoordinator` 的运行时输入和 `TeamDispatchPlan`：它们分别解决“统筹看到了什么”和“本轮决定调用什么”，不能把任务级选择写死进专家包。
- 保留 `skipped`：跳过成员没有结果，必须和真实完成结果区分；删除它会让下游无法判断缺口。
- 删除独立的 `handoff` 状态：交接内容直接复用已完成步骤的结果，避免额外同步状态。
- 删除团队级 `finalMember`：默认取 `steps` 声明的最后一个步骤，减少一个需要维护的配置字段并保持结果确定。
- 删除模型、密钥、工具权限配置：它们属于宿主执行器和运行环境，不属于公开专家包。

## 路线图

1. Registry：Git 仓库索引、版本锁定、签名和审核状态。
2. Runtime：宿主适配器、工具权限、流式事件和任务取消。
3. Team Studio：拖拽编排、并行分支、失败重试与人工审批节点。
4. Marketplace：账号、发布审核、评分、依赖扫描和安装锁文件。
5. Sandbox：按宿主能力选择 WASI、容器或进程级隔离，不把隔离能力假设成前端功能。

## 参与贡献

欢迎提交 issue 或 pull request。适配第三方内容前，请确认其许可证允许复制/派生，并在 `docs/github-skill-adaptations.md` 中记录来源、路径、固定 commit 和许可证。

## License

[MIT](LICENSE)