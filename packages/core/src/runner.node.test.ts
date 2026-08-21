import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryRegistry, TeamRunner, type ExpertManifest, type TeamManifest } from "./index.ts";

const expert = (id: string): ExpertManifest => ({
  apiVersion: "expert/v1",
  kind: "expert",
  metadata: { id, name: id, version: "0.1.0", description: "测试专家", author: "test", tags: ["test"] },
  spec: { instructions: "完成测试任务", capabilities: ["test"] },
});

const team: TeamManifest = {
  apiVersion: "expert/v1",
  kind: "team",
  metadata: { id: "team.test", name: "测试专家团", version: "0.1.0", description: "测试依赖与交接", author: "test", tags: ["test"] },
  spec: {
    members: [
      { id: "research", expert: "expert.research", role: "研究员" },
      { id: "write", expert: "expert.writer", role: "编辑" },
    ],
    steps: [{ member: "research" }, { member: "write", dependsOn: ["research"] }],
  },
};

test("按依赖顺序把前一步结果交给后一步", async () => {
  const registry = new InMemoryRegistry();
  registry.registerExpert(expert("expert.research"));
  registry.registerExpert(expert("expert.writer"));
  registry.registerTeam(team);
  const runner = new TeamRunner(registry, async ({ member, completed }) => ({
    status: "completed",
    content: member.id === "write" ? `汇总：${completed.research.content}` : "研究结论",
  }));
  const result = await runner.run("team.test", "写一份报告");
  assert.equal(result.final.content, "汇总：研究结论");
  assert.deepEqual(Object.keys(result.outputs), ["research", "write"]);
  assert.deepEqual(result.dispatch.skippedMembers, []);
});

test("统筹 Agent 可以分轮选择专家、分配子任务并跳过无关分支", async () => {
  const registry = new InMemoryRegistry();
  for (const id of ["architect", "gameplay", "assets", "qa", "integrator"]) {
    registry.registerExpert(expert(`expert.${id}`));
  }
  registry.registerTeam({
    ...team,
    metadata: { ...team.metadata, id: "team.dynamic" },
    spec: {
      members: [
        { id: "architect", expert: "expert.architect", role: "架构" },
        { id: "gameplay", expert: "expert.gameplay", role: "Gameplay" },
        { id: "assets", expert: "expert.assets", role: "资产" },
        { id: "qa", expert: "expert.qa", role: "QA" },
        { id: "integrator", expert: "expert.integrator", role: "集成" },
      ],
      steps: [
        { member: "architect" },
        { member: "gameplay", dependsOn: ["architect"] },
        { member: "assets", dependsOn: ["architect"] },
        { member: "qa", dependsOn: ["gameplay", "assets"] },
        { member: "integrator", dependsOn: ["qa"] },
      ],
    },
  });

  const assignments: string[] = [];
  const runner = new TeamRunner(registry, async ({ member, assignment, completed, skipped }) => {
    assignments.push(`${member.id}:${assignment}`);
    return { status: "completed", content: member.id === "qa" ? `QA 使用 ${completed.gameplay.content}；跳过 ${skipped.join(",")}` : member.id };
  });
  const result = await runner.run("team.dynamic", "修复角色移动", {
    coordinator: async ({ availableMembers, completed }) => {
      if (availableMembers.includes("architect")) return { calls: [{ member: "architect", task: "确认移动系统边界" }], skipMembers: [], rationale: "先确认架构" };
      if (availableMembers.includes("gameplay")) return { calls: [{ member: "gameplay", task: "定位输入和状态流转问题" }], skipMembers: ["assets"], rationale: "任务不涉及资产" };
      if (availableMembers.includes("qa")) return { calls: [{ member: "qa", task: `验证修复，参考 ${completed.gameplay.content}` }], skipMembers: [], rationale: "补上回归验证" };
      return { calls: [{ member: "integrator", task: "汇总修复、证据和未验证项" }], skipMembers: [], rationale: "形成最终交付" };
    },
  });

  assert.deepEqual(assignments.map((value) => value.split(":")[0]), ["architect", "gameplay", "qa", "integrator"]);
  assert.equal(assignments[1], "gameplay:定位输入和状态流转问题");
  assert.deepEqual(result.dispatch.selectedMembers, ["architect", "gameplay", "qa", "integrator"]);
  assert.deepEqual(result.dispatch.skippedMembers, ["assets"]);
  assert.match(result.dispatch.assignments.qa, /验证修复/);
  assert.match(result.outputs.qa.content, /跳过 assets/);
  assert.equal(result.final.content, "integrator");
});

test("同一轮可并行调用多个已选专家，并把跳过状态传给后续专家", async () => {
  const registry = new InMemoryRegistry();
  for (const id of ["architect", "gameplay", "assets", "integrator"]) registry.registerExpert(expert(`expert.${id}`));
  registry.registerTeam({
    ...team,
    metadata: { ...team.metadata, id: "team.parallel" },
    spec: {
      members: [
        { id: "architect", expert: "expert.architect", role: "架构" },
        { id: "gameplay", expert: "expert.gameplay", role: "Gameplay" },
        { id: "assets", expert: "expert.assets", role: "资产" },
        { id: "integrator", expert: "expert.integrator", role: "集成" },
      ],
      steps: [
        { member: "architect" },
        { member: "gameplay", dependsOn: ["architect"] },
        { member: "assets", dependsOn: ["architect"] },
        { member: "integrator", dependsOn: ["gameplay"] },
      ],
    },
  });

  const active = new Set<string>();
  let maxActive = 0;
  const runner = new TeamRunner(registry, async ({ member, skipped }) => {
    active.add(member.id);
    maxActive = Math.max(maxActive, active.size);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active.delete(member.id);
    return { status: "completed", content: `${member.id};跳过=${skipped.join(",")}` };
  });
  const result = await runner.run("team.parallel", "完成任务", {
    coordinator: async ({ availableMembers }) => {
      if (availableMembers.includes("architect")) return { calls: [{ member: "architect", task: "确认边界" }], skipMembers: [], rationale: "先确定边界" };
      if (availableMembers.includes("gameplay")) return {
        calls: [
          { member: "gameplay", task: "实现玩法" },
          { member: "assets", task: "确认资产需求" },
        ],
        skipMembers: [],
        rationale: "两个独立分支并行",
      };
      return { calls: [{ member: "integrator", task: "汇总结果" }], skipMembers: [], rationale: "完成集成" };
    },
  });

  assert.equal(maxActive, 2);
  assert.match(result.outputs.assets.content, /跳过=$/);
});

test("统筹 Agent 不能在依赖完成前调用专家", async () => {
  const registry = new InMemoryRegistry();
  registry.registerExpert(expert("expert.research"));
  registry.registerExpert(expert("expert.writer"));
  registry.registerTeam(team);
  const runner = new TeamRunner(registry, async () => ({ status: "completed", content: "不应执行" }));
  await assert.rejects(
    () => runner.run("team.test", "测试", {
      coordinator: async () => ({ calls: [{ member: "write", task: "跳过研究直接写作" }], skipMembers: [], rationale: "错误计划" }),
    }),
    /依赖完成前调用成员/,
  );
});

test("统筹 Agent 不能跳过最终集成步骤", async () => {
  const registry = new InMemoryRegistry();
  registry.registerExpert(expert("expert.research"));
  registry.registerExpert(expert("expert.writer"));
  registry.registerTeam(team);
  const runner = new TeamRunner(registry, async () => ({ status: "completed", content: "不应执行" }));
  await assert.rejects(
    () => runner.run("team.test", "测试", {
      coordinator: async ({ availableMembers }) => ({
        calls: availableMembers.includes("research") ? [{ member: "research", task: "研究" }] : [],
        skipMembers: availableMembers.includes("research") ? [] : ["write"],
        rationale: "错误地跳过最终集成",
      }),
    }),
    /不能跳过最终集成步骤/,
  );
});

test("拒绝循环依赖", async () => {
  const registry = new InMemoryRegistry();
  registry.registerExpert(expert("expert.a"));
  registry.registerExpert(expert("expert.b"));
  registry.registerTeam({
    ...team,
    metadata: { ...team.metadata, id: "team.cycle" },
    spec: {
      members: [{ id: "a", expert: "expert.a", role: "A" }, { id: "b", expert: "expert.b", role: "B" }],
      steps: [{ member: "a", dependsOn: ["b"] }, { member: "b", dependsOn: ["a"] }],
    },
  });
  const runner = new TeamRunner(registry, async () => ({ status: "completed", content: "不会执行" }));
  await assert.rejects(() => runner.run("team.cycle", "测试"), /循环依赖/);
});
