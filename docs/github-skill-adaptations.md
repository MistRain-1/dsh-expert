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

## 扩充批次来源（研究快照：2026-08-26）

以下 75 个新增专家来自六个 MIT 来源仓库。全部条目读取了实际来源文件与许可证，并固定 commit；适配只保留职责、检查方法与验收边界，提示词均为中文重写。

### wshobson/agents（MIT）

固定 commit：`d82998e7df393c671ede2387a8435075f0b633f5`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.backend-api-architect` | [plugins/api-scaffolding/agents/backend-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/api-scaffolding/agents/backend-architect.md) | MIT | 提炼单一职责与验收边界，重写为评审并设计后端接口契约、版本与韧性方案，不负责界面实现与基础。 |
| `expert.graphql-schema-designer` | [plugins/api-scaffolding/agents/graphql-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/api-scaffolding/agents/graphql-architect.md) | MIT | 提炼单一职责与验收边界，重写为专注查询层类型结构设计与兼容演进，不负责客户端接入和服务部署。 |
| `expert.event-sourcing-architect` | [plugins/backend-development/agents/event-sourcing-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/backend-development/agents/event-sourcing-architect.md) | MIT | 提炼单一职责与验收边界，重写为以不可变事件为核心建模业务过程与审计追溯，不负责普通增删改查。 |
| `expert.database-modeling-specialist` | [plugins/database-design/agents/database-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/database-design/agents/database-architect.md) | MIT | 提炼单一职责与验收边界，重写为从零规划数据模型与存储选型并预留扩展空间，不负责日常运维调参。 |
| `expert.database-performance-optimizer` | [plugins/database-migrations/agents/database-optimizer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/database-migrations/agents/database-optimizer.md) | MIT | 提炼单一职责与验收边界，重写为以实测数据定位慢查询与瓶颈并给可回退优化，不做无度量的猜测。 |
| `expert.sql-code-reviewer` | [plugins/database-design/agents/sql-pro.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/database-design/agents/sql-pro.md) | MIT | 提炼单一职责与验收边界，重写为评审数据访问语句的正确性、事务边界与执行效率，不负责库表架构。 |
| `expert.data-pipeline-engineer` | [plugins/data-engineering/agents/data-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/data-engineering/agents/data-engineer.md) | MIT | 提炼单一职责与验收边界，重写为设计并守护从数据源到目标端的可靠批流数据管道；不负责报表与可。 |
| `expert.cloud-landing-zone-advisor` | [plugins/cloud-infrastructure/agents/cloud-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/cloud-infrastructure/agents/cloud-architect.md) | MIT | 提炼单一职责与验收边界，重写为规划安全、经济且可扩展的云上着陆区与总体架构；不负责应用编码。 |
| `expert.kubernetes-platform-engineer` | [plugins/cicd-automation/agents/kubernetes-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/cicd-automation/agents/kubernetes-architect.md) | MIT | 提炼单一职责与验收边界，重写为搭建并治理多租户容器平台，覆盖发布与弹性伸缩；不负责业务应用。 |
| `expert.terraform-iac-reviewer` | [plugins/deployment-strategies/agents/terraform-specialist.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/deployment-strategies/agents/terraform-specialist.md) | MIT | 提炼单一职责与验收边界，重写为评审基础设施即代码的结构、状态与变更风险；不负责编写全新业务。 |
| `expert.network-reliability-engineer` | [plugins/cloud-infrastructure/agents/network-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/cloud-infrastructure/agents/network-engineer.md) | MIT | 提炼单一职责与验收边界，重写为分层诊断网络连通性与性能问题，补强冗余与切换；不负责主机内进。 |
| `expert.devops-troubleshooter` | [plugins/cicd-automation/agents/devops-troubleshooter.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/cicd-automation/agents/devops-troubleshooter.md) | MIT | 提炼单一职责与验收边界，重写为按日志、指标与调用链快速定位线上故障并组织恢复；不负责新功能。 |
| `expert.release-deployment-strategist` | [plugins/deployment-strategies/agents/deployment-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/deployment-strategies/agents/deployment-engineer.md) | MIT | 提炼单一职责与验收边界，重写为设计零停机发布与回滚策略，不负责业务代码开发与基础设施搭建。 |
| `expert.incident-commander` | [plugins/incident-response/agents/incident-responder.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/incident-response/agents/incident-responder.md) | MIT | 提炼单一职责与验收边界，重写为统筹事故指挥沟通与缓解决策并推动复盘，不做一线具体排障修复。 |
| `expert.log-forensics-analyst` | [plugins/error-diagnostics/agents/error-detective.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/error-diagnostics/agents/error-detective.md) | MIT | 提炼单一职责与验收边界，重写为从海量日志提取错误模式并跨系统关联溯源，不负责修改业务代码。 |
| `expert.threat-modeling-specialist` | [plugins/security-scanning/agents/threat-modeling-expert.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/security-scanning/agents/threat-modeling-expert.md) | MIT | 提炼单一职责与验收边界，重写为在设计阶段识别威胁并给出缓解决策，不负责渗透测试与修补实施。 |
| `expert.payment-integration-reviewer` | [plugins/payment-processing/agents/payment-integration.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/payment-processing/agents/payment-integration.md) | MIT | 提炼单一职责与验收边界，重写为评审支付接入的安全性与对账兜底设计，不涉及真实交易资金操作。 |
| `expert.mobile-app-engineer` | [plugins/frontend-mobile-development/agents/mobile-developer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/frontend-mobile-development/agents/mobile-developer.md) | MIT | 提炼单一职责与验收边界，重写为把关移动应用的跨端架构性能与离线体验，不负责后端服务开发。 |
| `expert.ui-visual-designer` | [plugins/ui-design/agents/ui-designer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/ui-design/agents/ui-designer.md) | MIT | 提炼单一职责与验收边界，重写为设计可用且可落地的界面与组件规格，负责视觉与交互方案，不负责。 |
| `expert.accessibility-auditor` | [plugins/ui-design/agents/accessibility-expert.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/ui-design/agents/accessibility-expert.md) | MIT | 提炼单一职责与验收边界，重写为审计界面的无障碍问题并给出分级整改建议，不做整体视觉重设计。 |
| `expert.design-system-architect` | [plugins/ui-design/agents/design-system-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/ui-design/agents/design-system-architect.md) | MIT | 提炼单一职责与验收边界，重写为规划设计变量体系与组件库架构，支撑多产品一致的体验，不承担单。 |
| `expert.llm-application-engineer` | [plugins/llm-application-dev/agents/ai-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/llm-application-dev/agents/ai-engineer.md) | MIT | 提炼单一职责与验收边界，重写为设计生产可用的模型应用架构与检索增强链路，不负责模型训练与参。 |
| `expert.prompt-engineering-specialist` | [plugins/llm-application-dev/agents/prompt-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/llm-application-dev/agents/prompt-engineer.md) | MIT | 提炼单一职责与验收边界，重写为设计并迭代提示词以稳定获得目标输出，不负责模型选型与应用架构。 |
| `expert.vector-search-engineer` | [plugins/llm-application-dev/agents/vector-database-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/llm-application-dev/agents/vector-database-engineer.md) | MIT | 提炼单一职责与验收边界，重写为构建高性能的语义向量检索链路并调优召回，不负责模型训练与业务。 |
| `expert.mlops-pipeline-engineer` | [plugins/machine-learning-ops/agents/mlops-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/machine-learning-ops/agents/mlops-engineer.md) | MIT | 提炼单一职责与验收边界，重写为负责把机器学习训练与发布流程工程化为自动化流水线，不做算法建。 |
| `expert.data-science-investigator` | [plugins/machine-learning-ops/agents/data-scientist.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/machine-learning-ops/agents/data-scientist.md) | MIT | 提炼单一职责与验收边界，重写为用统计方法与预测模型从数据中提炼可验证的业务结论，不负责搭建。 |
| `expert.business-process-analyst` | [plugins/business-analytics/agents/business-analyst.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/business-analytics/agents/business-analyst.md) | MIT | 提炼单一职责与验收边界，重写为构建业务指标体系并把数据洞察转为经营决策建议，不负责底层数据。 |
| `expert.startup-market-analyst` | [plugins/startup-business-analyst/agents/startup-analyst.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/startup-business-analyst/agents/startup-analyst.md) | MIT | 提炼单一职责与验收边界，重写为为早期创业项目测算市场空间并建立财务模型，不代替创始人做最终。 |
| `expert.content-marketing-strategist` | [plugins/content-marketing/agents/content-marketer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/content-marketing/agents/content-marketer.md) | MIT | 提炼单一职责与验收边界，重写为制定内容营销策略并规划多渠道分发与效果衡量，不负责单篇文案代。 |
| `expert.seo-content-strategist` | [plugins/seo-content-creation/agents/seo-content-planner.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/seo-content-creation/agents/seo-content-planner.md) | MIT | 提炼单一职责与验收边界，重写为围绕搜索意图规划主题集群与内容大纲日历，不负责具体文章的撰写。 |
| `expert.documentation-architect` | [plugins/code-documentation/agents/docs-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/code-documentation/agents/docs-architect.md) | MIT | 提炼单一职责与验收边界，重写为把既有系统的结构与设计取舍整理成长篇技术文档，不承担代码评审。 |
| `expert.tutorial-learning-designer` | [plugins/documentation-generation/agents/tutorial-engineer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/documentation-generation/agents/tutorial-engineer.md) | MIT | 提炼单一职责与验收边界，重写为把复杂技术主题改造成渐进式动手教程，不负责接口手册与营销文案。 |
| `expert.api-reference-writer` | [plugins/api-testing-observability/agents/api-documenter.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/api-testing-observability/agents/api-documenter.md) | MIT | 提炼单一职责与验收边界，重写为为接口编写准确易查的参考文档并附可运行示例，不做门户搭建与版。 |
| `expert.architecture-diagrammer` | [plugins/documentation-generation/agents/mermaid-expert.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/documentation-generation/agents/mermaid-expert.md) | MIT | 提炼单一职责与验收边界，重写为把系统结构、模块依赖与交互流程绘成清晰图表，不做编码实现与性。 |
| `expert.legacy-modernization-planner` | [plugins/framework-migration/agents/legacy-modernizer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/framework-migration/agents/legacy-modernizer.md) | MIT | 提炼单一职责与验收边界，重写为为老旧系统制定小步安全、随时可停的演进路线，不做推倒重写式改。 |
| `expert.monorepo-structure-planner` | [plugins/developer-essentials/agents/monorepo-architect.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/developer-essentials/agents/monorepo-architect.md) | MIT | 提炼单一职责与验收边界，重写为在单一代码库内规划多项目的结构与构建协作方式，不负责业务逻辑。 |
| `expert.developer-experience-optimizer` | [plugins/team-collaboration/agents/dx-optimizer.md](https://github.com/wshobson/agents/blob/d82998e7df393c671ede2387a8435075f0b633f5/plugins/team-collaboration/agents/dx-optimizer.md) | MIT | 提炼单一职责与验收边界，重写为缩短环境上手时间并疏通日常研发堵点，不负责业务功能的设计实现。 |

### K-Dense-AI/scientific-agent-skills（MIT）

固定 commit：`36d8f13a1e754618794bf42f417884940077b4ae`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.experiment-design-advisor` | [skills/experimental-design/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/experimental-design/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为在数据采集前设计可解释的对照实验方案，不负责事后数据分析与补。 |
| `expert.eda-analyst` | [skills/exploratory-data-analysis/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/exploratory-data-analysis/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为建模前对已获授权数据做有边界的探索性检查并提出待验证假设，不。 |
| `expert.hypothesis-generator` | [skills/hypothesis-generation/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/hypothesis-generation/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把观察转化为可证伪的研究假设与区分性预测，不负责实验执行与假。 |
| `expert.peer-review-simulator` | [skills/peer-review/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/peer-review/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为以审稿人视角对稿件做结构化评估并起草意见，不代替编辑作录用决。 |
| `expert.scientific-writing-editor` | [skills/scientific-writing/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/scientific-writing/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为编辑科技文稿的结构逻辑与表达准确性，不改动科学事实也不代作者。 |
| `expert.scientific-critical-reader` | [skills/scientific-critical-thinking/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/scientific-critical-thinking/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为批判性评估论文主张与证据质量并分级指出缺陷，不负责改写文稿。 |
| `expert.statistical-analysis-reviewer` | [skills/statistical-analysis/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/statistical-analysis/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为审查统计方法与数据的匹配及结果报告规范，不代替研究者下科学结。 |
| `expert.statistical-power-planner` | [skills/statistical-power/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/statistical-power/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为在设计阶段估算样本量与检验功效并给出敏感性区间，不做事后功效。 |
| `expert.uncertainty-units-checker` | [skills/uncertainty-and-units/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/uncertainty-and-units/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为审查计算结果的单位一致性与不确定度处理并做量级合理性检查，不。 |
| `expert.scientific-visualization-designer` | [skills/scientific-visualization/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/scientific-visualization/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为设计忠实呈现数据且无障碍可达的科学图表，不美化扭曲数据也不下。 |
| `expert.citation-auditor` | [skills/citation-management/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/citation-management/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为核查参考文献的真实性完整性与格式一致性并追踪主张支撑，不代写。 |
| `expert.research-brainstorm-facilitator` | [skills/scientific-brainstorming/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/scientific-brainstorming/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为引导研究方向构想的发散收敛与透明评估，不负责实证验证与伦理审。 |
| `expert.research-grant-planner` | [skills/research-grants/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/research-grants/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为规划基金申请书的立论结构与评审应对策略，不代写科学内容亦不保。 |
| `expert.market-research-analyst` | [skills/market-research-reports/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/market-research-reports/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为构建证据可追溯的市场研究与规模测算报告，不提供投资法律等专业。 |
| `expert.bio-pathway-analyst` | [skills/pathway-enrichment/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/pathway-enrichment/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为解读基因集合的通路富集信号并把关方法学陷阱，不直接下生物学因。 |
| `expert.term-ontology-curator` | [skills/ontology-term-resolution/SKILL.md](https://github.com/K-Dense-AI/scientific-agent-skills/blob/36d8f13a1e754618794bf42f417884940077b4ae/skills/ontology-term-resolution/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把自由文本术语解析到受控词表并审核标识符有效性，不擅自合并歧。 |

### obra/superpowers（MIT）

固定 commit：`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.verification-gatekeeper` | [skills/verification-before-completion/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/verification-before-completion/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为以新鲜可复核的验证证据为完成前提，杜绝无凭据的完成宣告。 |
| `expert.plan-document-writer` | [skills/writing-plans/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/writing-plans/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把需求固化成零上下文执行者无需追问即可照做的书面计划。 |
| `expert.plan-execution-tracker` | [skills/executing-plans/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/executing-plans/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为按既定计划逐任务推进，边做边验，保持进度与偏差可见。 |
| `expert.review-request-preparer` | [skills/requesting-code-review/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/requesting-code-review/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为在送审前备齐变更摘要、依据与疑点，让评审者低成本上手。 |
| `expert.review-feedback-triager` | [skills/receiving-code-review/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/receiving-code-review/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为逐条核实并分类处置评审意见：接受修复、举证反驳或有据延期。 |
| `expert.worktree-workflow-coach` | [skills/using-git-worktrees/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/using-git-worktrees/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为指导用隔离工作副本并行推进互扰任务，守住稳定主线基线。 |
| `expert.parallel-delegation-planner` | [skills/dispatching-parallel-agents/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/dispatching-parallel-agents/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把大任务拆成互不冲突的并行子任务，定义分工与汇总协议。 |
| `expert.brainstorm-facilitator` | [skills/brainstorming/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/brainstorming/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为主持结构化头脑风暴：分类定档、一次一问，收敛为经批准的设计。 |
| `expert.system-triage-specialist` | [skills/systematic-debugging/SKILL.md](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/skills/systematic-debugging/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把电脑故障描述变成有序、可逆的排查路线，不代替维修判断。 |

### JimLiu/baoyu-skills（MIT）

固定 commit：`6b7a2e417500561a5ecdd0b168332f4142584617`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.technical-translator` | [skills/baoyu-translate/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-translate/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为在中英文间精译技术内容，术语一致，代码与格式原样保留。 |
| `expert.concept-diagram-designer` | [skills/baoyu-diagram/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-diagram/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把概念与系统关系设计成清晰的图表结构和绘图脚本文字稿。 |
| `expert.infographic-planner` | [skills/baoyu-infographic/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-infographic/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为规划信息图的内容分区、数据要点与版式，输出设计文字稿。 |
| `expert.slide-narrative-designer` | [skills/baoyu-slide-deck/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-slide-deck/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把内容设计成逐页大纲与讲述线，输出幻灯叙事文字稿。 |
| `expert.web-content-extractor` | [skills/baoyu-url-to-markdown/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-url-to-markdown/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把已授权获取的网页内容整理成干净、保留出处的正文文稿。 |
| `expert.transcript-summarizer` | [skills/baoyu-youtube-transcript/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-youtube-transcript/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为提炼音视频转写稿的主题脉络，产出带时间戳引用的要点摘要。 |
| `expert.article-illustration-briefer` | [skills/baoyu-article-illustrator/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-article-illustrator/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为为文章规划配图位置与画面意图，产出给插画环节的视觉简报。 |
| `expert.cover-art-briefer` | [skills/baoyu-cover-image/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-cover-image/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为依文章主旨设计封面视觉方向，产出多方案的封面简报文字稿。 |
| `expert.social-summary-writer` | [skills/baoyu-wechat-summary/SKILL.md](https://github.com/JimLiu/baoyu-skills/blob/6b7a2e417500561a5ecdd0b168332f4142584617/skills/baoyu-wechat-summary/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为把长文或记录素材改写成事实完整、归属清晰的社交精华摘要。 |

### addyosmani/agent-skills（MIT）

固定 commit：`5a5ea45e806f82273549fd85e60adb95d55f510d`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.doubt-driven-reviewer` | [skills/doubt-driven-development/SKILL.md](https://github.com/addyosmani/agent-skills/blob/5a5ea45e806f82273549fd85e60adb95d55f510d/skills/doubt-driven-development/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为以先找反证的立场评审结论与方案，输出问题清单与处置分级。 |
| `expert.requirements-interviewer` | [skills/interview-me/SKILL.md](https://github.com/addyosmani/agent-skills/blob/5a5ea45e806f82273549fd85e60adb95d55f510d/skills/interview-me/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为逐题访谈澄清模糊需求，产出经用户确认的结构化意图纪要。 |
| `expert.skill-selection-advisor` | [skills/using-agent-skills/SKILL.md](https://github.com/addyosmani/agent-skills/blob/5a5ea45e806f82273549fd85e60adb95d55f510d/skills/using-agent-skills/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为依据任务特征从可用技能清单选型，说明组合顺序与取舍。 |

### jcordon5/disk-cleaner-skill（MIT）

固定 commit：`231f9025d6bb3f62616c7927ff3baedc164a54aa`。以下专家只提炼来源的职责、检查方法与验收边界，全部用中文重写；不导入脚本、宿主命令、模型字段或权限配置。

| Expert Market 专家 | 来源文件 | 许可证 | 适配方式 |
| --- | --- | --- | --- |
| `expert.disk-space-optimizer` | [SKILL.md](https://github.com/jcordon5/disk-cleaner-skill/blob/231f9025d6bb3f62616c7927ff3baedc164a54aa/SKILL.md) | MIT | 提炼单一职责与验收边界，重写为在数据零损失前提下定位并释放磁盘空间，清理先审批。 |


### 个人电脑排障专家的适配说明

`expert.system-triage-specialist` 只泛化 systematic-debugging 的系统化排查纪律（先根因后修复、分层定位、无损优先、可逆操作），场景从代码调试扩展到个人电脑故障分诊；`expert.disk-space-optimizer` 遵循 disk-cleaner-skill 的安全清理原则（测量先行、按风险分级、删除前必须获得明确批准、受保护数据永不删、优先可恢复路径），占用分类与长期巡检建议为本项目原创重写，两者都不导入任何脚本、命令或宿主权限。

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
## 新增游戏专家团（第 3 批：游戏行业，2026-08-26）

来源为已审计的 MIT 仓库；角色类型启发自 WorkBuddy 技能范畴（见下文注意事项），提示词为本项目原创。

| 专家 id | 来源仓库与 pinned commit | 说明 |
|---|---|---|
| expert.shader-specialist | wshobson/agents@d82998e game-development/agents/unity-developer.md | Shader Graph/HLSL 优化，Profiler 量化 |
| expert.technical-rigger | wshobson/agents@d82998e game-development/agents/unity-developer.md | 骨骼绑定、蒙皮权重、Animator IK |
| expert.game-vfx-artist | wshobson/agents@d82998e game-development/agents/unity-developer.md | VFX Graph/粒子与性能预算 |
| expert.game-ui-ux-designer | wshobson/agents@d82998e multi-platform-apps/agents/ui-ux-designer.md | 游戏界面信息层级与可访问性 |
| expert.console-performance-engineer | wshobson/agents@d82998e application-performance/agents/performance-engineer.md | 帧预算/Profiler/LOD/batching |
| expert.gameplay-automation-engineer | wshobson/agents@d82998e tdd-workflows/agents/tdd-orchestrator.md | 玩法自动化回放与回归 |
| expert.liveops-producer | addyosmani/agent-skills@5a5ea45 skills/shipping-and-launch/SKILL.md | 发布清单、灰度、回滚 |
| expert.combat-system-designer | K-Dense-AI/scientific-agent-skills@36d8f13 skills/experimental-design/SKILL.md | 战斗机制与 A/B 平衡试验 |
| team.game-development | 同上 9 位专家的协作团 | 策划→技术桥接→设计→架构→网络/AI/音频/关卡→分析→生产统筹 |

### 参考资料来源（发现用，非导入）

- infometa/workbuddyskills（264 星）：WorkBuddy 专家/技能归档，无 LICENSE，仅作专家范畴发现参考（如 ai-content-creator-team、apm-performance-expert、app-store-optimization-expert、gameplay-ai-agent 等），未直接导入其内容。
- AlephAITech/WorkBuddyGuide（2635 星, MIT）：部署入门指南，非技能文件。
- zjp1997720/zhijian-ai-bluebook-workbuddy-harness（196 星, 无 LICENSE）：WorkBuddy 解析蓝皮书，链接参考，不导入。

遵守规则：任何无 LICENSE 来源仅作发现与链接，不导入内容、不当授权。
