import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  installHostSkill,
  renderExpertSkill,
  renderTeamSkill,
  skillNameForId,
  type ExpertManifest,
  type TeamManifest,
} from "./index.ts";

const architect: ExpertManifest = {
  apiVersion: "expert/v1",
  kind: "expert",
  metadata: {
    id: "expert.unity-architect",
    name: "Unity Architect",
    version: "1.0.0",
    description: "设计 Unity 项目边界",
    author: "test",
    tags: ["Unity", "架构"],
  },
  spec: {
    instructions: "你负责设计 Unity 项目边界。",
    capabilities: ["项目发现", "模块拆分"],
  },
};

const team: TeamManifest = {
  apiVersion: "expert/v1",
  kind: "team",
  metadata: {
    id: "team.unity-development",
    name: "Unity Development Team",
    version: "1.0.0",
    description: "按依赖交付 Unity 开发方案",
    author: "test",
    tags: ["Unity", "协作"],
  },
  spec: {
    members: [{ id: "architect", expert: architect.metadata.id, role: "架构师" }],
    steps: [{ member: "architect" }],
  },
};

test("专家 Skill 包含标准 frontmatter 和安全边界", () => {
  const skill = renderExpertSkill(architect);
  assert.match(skill, /^---\nname: 'expert-unity-architect'/);
  assert.match(skill, /# Unity Architect/);
  assert.match(skill, /不授予模型、密钥、网络、文件系统或 MCP 权限/);
});

test("专家团 Skill 内嵌成员职责和依赖顺序", () => {
  const skill = renderTeamSkill(team, new Map([[architect.metadata.id, architect]]));
  assert.match(skill, /# Unity Development Team/);
  assert.match(skill, /架构师/);
  assert.match(skill, /统筹 Agent 分发协议/);
  assert.match(skill, /skipMembers/);
  assert.match(skill, /calls/);
  assert.match(skill, /最终输出取最后一个步骤的结果/);
});

test("安装器默认拒绝覆盖，force 才允许更新", async () => {
  const root = await mkdtemp(join(tmpdir(), "expert-market-"));
  try {
    const first = await installHostSkill(architect, new Map(), {
      host: "codex",
      scope: "project",
      destination: join(root, "skills"),
    });
    assert.equal(first.skillName, skillNameForId(architect.metadata.id));
    assert.match(await readFile(first.filePath, "utf8"), /Unity Architect/);

    await assert.rejects(
      () => installHostSkill(architect, new Map(), { host: "codex", destination: join(root, "skills") }),
      /Skill 已存在/,
    );
    const forced = await installHostSkill(architect, new Map(), {
      host: "codex",
      destination: join(root, "skills"),
      force: true,
    });
    assert.equal(forced.filePath, first.filePath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
