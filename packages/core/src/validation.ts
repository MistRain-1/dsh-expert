import type { ExpertManifest, TeamManifest } from "./types.ts";

function requireText(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} 必须是非空字符串`);
  }
}

function requireTextList(value: unknown, path: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${path} 必须是字符串数组`);
  }
}

/** 校验专家声明，拒绝会导致运行时歧义的最小错误集合。 */
export function validateExpertManifest(manifest: ExpertManifest): void {
  if (manifest.apiVersion !== "expert/v1" || manifest.kind !== "expert") {
    throw new Error("专家声明必须使用 expert/v1 与 expert kind");
  }

  requireText(manifest.metadata.id, "metadata.id");
  requireText(manifest.metadata.name, "metadata.name");
  requireText(manifest.metadata.version, "metadata.version");
  requireText(manifest.metadata.description, "metadata.description");
  requireText(manifest.metadata.author, "metadata.author");
  requireTextList(manifest.metadata.tags, "metadata.tags");
  requireText(manifest.spec.instructions, "spec.instructions");
  requireTextList(manifest.spec.capabilities, "spec.capabilities");
}

/** 校验专家团引用和依赖图，防止运行到一半才发现无法交接。 */
export function validateTeamManifest(manifest: TeamManifest): void {
  if (manifest.apiVersion !== "expert/v1" || manifest.kind !== "team") {
    throw new Error("专家团声明必须使用 expert/v1 与 team kind");
  }

  requireText(manifest.metadata.id, "metadata.id");
  requireText(manifest.metadata.name, "metadata.name");
  requireText(manifest.metadata.version, "metadata.version");
  requireText(manifest.metadata.description, "metadata.description");
  requireText(manifest.metadata.author, "metadata.author");
  requireTextList(manifest.metadata.tags, "metadata.tags");

  if (manifest.spec.members.length === 0 || manifest.spec.steps.length === 0) {
    throw new Error("专家团至少需要一个成员和一个步骤");
  }

  const memberIds = new Set<string>();
  for (const member of manifest.spec.members) {
    requireText(member.id, "spec.members[].id");
    requireText(member.expert, `成员 ${member.id} 的 expert`);
    requireText(member.role, `成员 ${member.id} 的 role`);
    if (memberIds.has(member.id)) {
      throw new Error(`成员 ID 重复：${member.id}`);
    }
    memberIds.add(member.id);
  }

  const stepIds = new Set<string>();
  for (const step of manifest.spec.steps) {
    if (!memberIds.has(step.member)) {
      throw new Error(`步骤引用了不存在的成员：${step.member}`);
    }
    if (stepIds.has(step.member)) {
      throw new Error(`成员不能重复出现在步骤中：${step.member}`);
    }
    stepIds.add(step.member);
    for (const dependency of step.dependsOn ?? []) {
      if (!memberIds.has(dependency)) {
        throw new Error(`步骤 ${step.member} 依赖了不存在的成员：${dependency}`);
      }
      if (dependency === step.member) {
        throw new Error(`步骤不能依赖自身：${step.member}`);
      }
    }
  }

  for (const step of manifest.spec.steps) {
    for (const dependency of step.dependsOn ?? []) {
      if (!stepIds.has(dependency)) {
        throw new Error(`步骤 ${step.member} 依赖的成员没有执行步骤：${dependency}`);
      }
    }
  }
}
