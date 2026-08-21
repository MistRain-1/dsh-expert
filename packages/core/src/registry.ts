import { validateExpertManifest, validateTeamManifest } from "./validation.ts";
import type { ExpertManifest, TeamManifest } from "./types.ts";

/** 本地注册表。云端市场只需要实现同一组读取契约即可替换。 */
export class InMemoryRegistry {
  private readonly experts = new Map<string, ExpertManifest>();
  private readonly teams = new Map<string, TeamManifest>();

  /** 注册一个专家版本；同一个 ID 只允许一个当前版本。 */
  registerExpert(manifest: ExpertManifest): void {
    validateExpertManifest(manifest);
    this.experts.set(manifest.metadata.id, manifest);
  }

  /** 注册一个专家团，并检查其成员引用的专家是否存在。 */
  registerTeam(manifest: TeamManifest): void {
    validateTeamManifest(manifest);
    for (const member of manifest.spec.members) {
      if (!this.experts.has(member.expert)) {
        throw new Error(`专家团 ${manifest.metadata.id} 找不到专家：${member.expert}`);
      }
    }
    this.teams.set(manifest.metadata.id, manifest);
  }

  getExpert(id: string): ExpertManifest {
    const expert = this.experts.get(id);
    if (!expert) throw new Error(`找不到专家：${id}`);
    return expert;
  }

  getTeam(id: string): TeamManifest {
    const team = this.teams.get(id);
    if (!team) throw new Error(`找不到专家团：${id}`);
    return team;
  }
}
