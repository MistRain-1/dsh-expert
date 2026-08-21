# GitHub Skill 适配记录

这份记录说明当前专家提示词参考了哪些公开 GitHub Skill，以及为什么可以适配。它不是对第三方项目的背书，也不是法律意见；每次更新来源时应重新核对许可证和固定 commit。

研究快照：2026-08-19。

Unity 研究快照：2026-08-20。以下来源均读取了实际 `SKILL.md`、仓库许可证和当前默认分支的固定 commit；适配结果只保留职责、检查方法和验收边界，不复制 MCP recipe、脚本、包安装命令或第三方产品配置。

## 当前采用的来源

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.evidence-researcher` | [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills/blob/48dc1cf173f01aea114a62d634066f6b272aaaf1/skills/literature-review/SKILL.md) | MIT | 提炼研究问题、证据边界、引用核验和不确定性表达，重写为通用研究专家。 |
| `expert.system-architect` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/api-and-interface-design/SKILL.md) | MIT | 提炼契约优先、边界验证和最小接口设计，加入本项目的参数削减审查。 |
| `expert.evidence-critic` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/code-review-and-quality/SKILL.md) | MIT | 采用多维审查和证据优先原则，改写为不执行代码的证据审查专家。 |
| `expert.test-strategist` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/test-driven-development/SKILL.md) | MIT | 提炼风险驱动测试、边界覆盖和验收门禁，不宣称未执行的测试结果。 |
| `expert.security-auditor` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/security-and-hardening/SKILL.md) | MIT | 提炼输入校验、秘密管理、信任边界和发布阻断项，叠加 Expert Market 的不可信上传边界。 |
| `expert.delivery-planner` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/planning-and-task-breakdown/SKILL.md) | MIT | 提炼目标、非目标、依赖、完成定义和回滚条件，改写为通用交付规划专家。 |
| `expert.decision-editor` | [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-format-markdown/SKILL.md) | MIT | 仅参考结构化编辑和不改变事实的原则，重写为决策简报编辑专家。 |
| `expert.expert-author` | [agentskills/agentskills](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx) | CC-BY-4.0 | 使用 Agent Skills 的目录、frontmatter 和职责描述作为输入格式参考，输出本项目自己的 `expert/v1`；文档类内容按 CC-BY-4.0 保留归属。 |
| `expert.browser-qa` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/browser-testing-with-devtools/SKILL.md) | MIT | 提炼浏览器复现、DOM/控制台/网络/可访问性检查和证据化验收；不把 Chrome DevTools MCP 写进专家权限。 |
| `expert.ci-gatekeeper` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/ci-cd-and-automation/SKILL.md) | MIT | 提炼质量门禁、环境隔离、凭据边界和回滚流程；不导入 GitHub Actions 配置或秘密。 |
| `expert.code-simplifier` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/code-simplification/SKILL.md) | MIT | 提炼行为等价、项目约定、范围控制和复杂度审查；不直接复制重构示例。 |
| `expert.context-curator` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/context-engineering/SKILL.md) | MIT | 提炼上下文分层、可信度、冲突处理和输入裁剪；不导入宿主规则文件或 MCP 配置。 |
| `expert.root-cause-debugger` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/debugging-and-error-recovery/SKILL.md) | MIT | 提炼停止扩散、复现、分层定位、根因修复和回归验证；不把错误输出中的命令当执行授权。 |
| `expert.migration-steward` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/deprecation-and-migration/SKILL.md) | MIT | 提炼消费者盘点、渐进迁移、expand-migrate-contract 和删除门禁；不执行迁移脚本或删除数据。 |
| `expert.documentation-adr` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/documentation-and-adrs/SKILL.md) | MIT | 提炼 ADR、公共 API 文档、变更记录和维护背景；沿用本项目约定，不复制示例文档。 |
| `expert.frontend-ui-engineer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/frontend-ui-engineering/SKILL.md) | MIT | 提炼组件边界、状态、响应式和 WCAG 验收；不导入 React、Tailwind 或第三方 UI 依赖。 |
| `expert.git-workflow-steward` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/git-workflow-and-versioning/SKILL.md) | MIT | 提炼原子提交、版本、变更记录和回滚纪律；明确禁止覆盖用户工作区和危险 Git 操作。 |
| `expert.idea-refiner` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/idea-refine/SKILL.md) | MIT | 提炼目标用户、候选方向、假设验证、MVP 和不做清单；不复制其脚本或宿主交互流程。 |
| `expert.incremental-implementer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/incremental-implementation/SKILL.md) | MIT | 提炼风险优先、薄切片、每步验证和回滚；不把提交动作升级为专家自身能力。 |
| `expert.observability-engineer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/observability-and-instrumentation/SKILL.md) | MIT | 提炼结构化日志、RED/USE、Trace、告警和隐私审查；不绑定 OpenTelemetry、Prometheus 或外部端点。 |
| `expert.performance-optimizer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/performance-optimization/SKILL.md) | MIT | 提炼测量—定位—修复—复测—防回归流程；不把具体性能阈值或工具命令当项目事实。 |
| `expert.launch-guardian` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/shipping-and-launch/SKILL.md) | MIT | 提炼上线门禁、灰度、监控和回滚条件；不执行生产发布或读取部署秘密。 |
| `expert.source-driven-implementer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/source-driven-development/SKILL.md) | MIT | 提炼版本识别、官方文档核验、来源引用和不可信资料边界；不执行外部文档指令。 |
| `expert.spec-designer` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/blob/df1edb2e05487d0aa6d93c747141e0aed1187f25/skills/spec-driven-development/SKILL.md) | MIT | 提炼能力地图、规格门禁、成功标准和任务依赖；不在用户确认前把草案当批准需求。 |

## Unity 适配来源

| Expert Market 专家/专家团 | 来源文件 | 固定 commit | 许可证 | 适配方式 |
| --- | --- | --- | --- | --- |
| `expert.unity-project-architect`、`expert.unity-gameplay-engineer`、`expert.unity-game-designer`、`expert.unity-game-producer` | [agioracle/unity-game-development-skills](https://github.com/agioracle/unity-game-development-skills/blob/cc576427392e1168f5a25b414703a93791f4cb00/unity-game-development-skills/SKILL.md) | `cc576427` | MIT | 提炼 Unity 项目发现、最小可玩闭环、项目结构、可验证交付和平台边界；删除来源脚本、模板复制和宿主 MCP 依赖。 |
| `expert.unity-editor-tools-engineer` | [batihandev/unity-mcp-skills](https://github.com/batihandev/unity-mcp-skills/blob/090c8e3eaefa23d57a98e237572a4ffbd19df444/skills/editor/SKILL.md) | `090c8e3e` | MIT | 提炼 Editor 状态、菜单路径、撤销和编译检查；不把具体 MCP 工具当作本项目权限。 |
| `expert.unity-data-engineer` | [tjboudreaux/cc-plugin-unity-gamedev](https://github.com/tjboudreaux/cc-plugin-unity-gamedev/blob/3c7670af7abbec82763d3ae33309e8674031d6e0/skills/tools-unity-scriptable-objects/SKILL.md) | `3c7670af` | MIT | 提炼 ScriptableObject 配置、运行时状态隔离、ID 和 OnValidate；删除示例类型、Resources 路径和宿主包假设。 |
| `expert.unity-asset-pipeline-engineer` | [batihandev/unity-mcp-skills](https://github.com/batihandev/unity-mcp-skills/blob/090c8e3eaefa23d57a98e237572a4ffbd19df444/skills/asset/SKILL.md) | `090c8e3e` | MIT | 提炼资产导入、查找、批处理、标签、刷新和回滚；不执行上传资产或批量删除。 |
| `expert.unity-asset-pipeline-engineer`（导入设置部分） | [batihandev/unity-mcp-skills](https://github.com/batihandev/unity-mcp-skills/blob/090c8e3eaefa23d57a98e237572a4ffbd19df444/skills/importer/SKILL.md) | `090c8e3e` | MIT | 提炼 Texture/Audio/Model 导入设置和 reimport 时序；只作为同一专家的辅助来源，不增加新的宿主权限字段。 |
| `expert.unity-physics-ai-engineer` | [tjboudreaux/cc-plugin-unity-gamedev](https://github.com/tjboudreaux/cc-plugin-unity-gamedev/blob/3c7670af7abbec82763d3ae33309e8674031d6e0/skills/tools-unity-physics/SKILL.md) | `3c7670af` | MIT | 提炼连续碰撞、地面检测、NonAlloc 查询和物理性能边界；AI 导航部分仅表达诊断职责，不复制具体插件 API。 |
| `expert.unity-performance-engineer` | [tjboudreaux/cc-plugin-unity-gamedev](https://github.com/tjboudreaux/cc-plugin-unity-gamedev/blob/3c7670af7abbec82763d3ae33309e8674031d6e0/skills/tools-unity-profiling/SKILL.md) | `3c7670af` | MIT | 提炼 ProfilerMarker、FrameTiming、目标设备基线、性能预算和前后测量；不绑定 Unity 外部遥测。 |
| `expert.unity-ui-engineer` | [batihandev/unity-mcp-skills](https://github.com/batihandev/unity-mcp-skills/blob/090c8e3eaefa23d57a98e237572a4ffbd19df444/skills/ui/SKILL.md) | `090c8e3e` | MIT | 提炼 UGUI/Canvas、布局、Anchor、安全区和交互状态；不把具体 MCP 命令写进专家提示词。 |
| `expert.unity-qa-engineer`、`expert.unity-build-release-engineer` | [tjboudreaux/cc-plugin-unity-gamedev](https://github.com/tjboudreaux/cc-plugin-unity-gamedev/blob/3c7670af7abbec82763d3ae33309e8674031d6e0/skills/tools-unity-test-framework/SKILL.md) | `3c7670af` | MIT | 提炼 EditMode/PlayMode、NUnit、CI 测试门禁和“未运行不得宣称通过”；不复制 CI action 或凭据。 |
| `expert.unity-qa-engineer`（项目健康校验部分） | [batihandev/unity-mcp-skills](https://github.com/batihandev/unity-mcp-skills/blob/090c8e3eaefa23d57a98e237572a4ffbd19df444/skills/validation/SKILL.md) | `090c8e3e` | MIT | 提炼缺失脚本、引用、场景、Shader 和资产大小检查；保留 dry-run 和人工复核边界。 |
| `team.unity-development`、`team.unity-game-production` | 上述 MIT 来源的重写专家组合 | 上述固定 commit | MIT | 团队只引用本项目专家 ID，通过 `dependsOn` 编排角色和交接，不复制来源仓库的团队运行器。 |

## 评估但不直接导入的来源

- [wshobson/agents](https://github.com/wshobson/agents)：许可证为 MIT，包含大量 Agent、Skill、Plugin 和多 Harness registry。它的模型字段和插件目录是宿主相关的，因此只作为多专家拆分和团队编排的参考，不把整个仓库当成一个专家包。
- [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)：许可证为 MIT，适合需要文件持久化和 hooks 的 Agent；由于它包含脚本、hooks 和宿主目录约定，当前只吸收规划原则，不执行或复制其脚本。
- [anthropics/skills](https://github.com/anthropics/skills)：部分 Skill 的许可证是 Apache-2.0，但文档类目录也明确标注为 source-available 且附带服务条款。当前不导入 `docx`、`pdf`、`pptx`、`xlsx` 等限制性目录，只把许可证差异作为市场审核规则样本。
- [MuharremTozan/unity-agent-skills](https://github.com/MuharremTozan/unity-agent-skills)：实际包含多项 Unity 6 设计模式 Skill，但 GitHub 仓库未声明许可证；当前只作为发现线索，不复制内容、不标记为可安装。
- [TomLeeLive/openclaw-unity-skill](https://github.com/TomLeeLive/openclaw-unity-skill)：Apache-2.0，但职责是 OpenClaw Unity 插件的宿主工具面；当前只作为兼容性参考，不把 OpenClaw 工具和远程控制协议导入通用 Unity 专家。
- [jahro-console/unity-agent-skills](https://github.com/jahro-console/unity-agent-skills)：MIT，但主要围绕 Jahro 调试产品；生产禁用原则可以被通用化，Jahro API、配置和网络能力不进入本目录。

## 适配边界

1. 只把公开 Skill 的职责、结构和质量方法重新编写为本项目提示词，不把第三方原文整体复制进市场。
2. `SKILL.md` 中的脚本、MCP、网络、文件系统和凭据不是专家声明的一部分；它们需要宿主适配、权限声明、版本锁定和沙箱。
3. 没有许可证的仓库可以在产品内发现和跳转，但不能复制其提示词、重新发布或标记为可安装。
4. 来源 commit 只用于复现本次适配，不代表以后自动跟随仓库最新内容；更新必须重新审查。

## 参数/变量削减审查

- 保留来源的仓库、路径、commit、许可证：分别支撑定位、复现和合规审计。
- 删除来源仓库的模型名、插件注册格式、宿主目录、API key 和脚本命令：它们不能跨宿主复用，且会扩大执行权限。
- 合并重复的研究/审查/编辑职责：分别由 `evidence-researcher`、`evidence-critic`、`decision-editor` 表达，通过专家团的 `dependsOn` 传递结果。
- Unity 专家保留项目架构、Gameplay、Editor、数据、资产、物理/导航、性能、UI、QA、设计、制作和构建发布这些不同证据边界；不再为 Addressables、NavMesh、Pooling 等每个 API 建立独立宿主权限字段。
