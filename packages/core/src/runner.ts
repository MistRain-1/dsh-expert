import type {
  ExpertExecutor,
  ExpertResult,
  TeamDispatchCall,
  TeamDispatchPlan,
  TeamDispatchResult,
  TeamManifest,
  TeamMember,
  TeamRunEvent,
  TeamRunOptions,
  TeamRunResult,
} from "./types.ts";
import { InMemoryRegistry } from "./registry.ts";
import { validateTeamManifest } from "./validation.ts";

/** 执行专家团；启用统筹 Agent 时按轮次动态选择专家、分配子任务和安排调用时机。 */
export class TeamRunner {
  private readonly registry: InMemoryRegistry;
  private readonly executor: ExpertExecutor;

  public constructor(registry: InMemoryRegistry, executor: ExpertExecutor) {
    this.registry = registry;
    this.executor = executor;
  }

  /** 执行一个专家团任务；没有 coordinator 时保持声明式全量执行兼容行为。 */
  public async run(teamId: string, task: string, options: TeamRunOptions = {}): Promise<TeamRunResult> {
    const team = this.registry.getTeam(teamId);
    validateTeamManifest(team);

    const memberById = new Map(team.spec.members.map((member) => [member.id, member]));
    const finalMember = team.spec.steps.at(-1)?.member;
    if (!finalMember) throw new Error("专家团没有产出最终步骤");

    if (!options.coordinator) return this.runDeclared(team, task, memberById, finalMember, options);
    return this.runWithCoordinator(team, task, memberById, finalMember, options);
  }

  /** 兼容旧调用方：按声明依赖执行全部步骤。 */
  private async runDeclared(
    team: TeamManifest,
    task: string,
    memberById: ReadonlyMap<string, TeamMember>,
    finalMember: string,
    options: TeamRunOptions,
  ): Promise<TeamRunResult> {
    const pending = new Map(team.spec.steps.map((step) => [step.member, step]));
    const outputs: Record<string, ExpertResult> = Object.create(null) as Record<string, ExpertResult>;
    const assignments: Record<string, string> = Object.create(null) as Record<string, string>;
    while (pending.size > 0) {
      const ready = [...pending.values()].filter((step) =>
        (step.dependsOn ?? []).every((dependency) => this.hasOutput(outputs, dependency)),
      );
      if (ready.length === 0) throw new Error(`专家团 ${team.metadata.id} 存在循环依赖或不可达步骤`);

      const calls = ready.map((step) => ({ member: step.member, task }));
      const batchResults = await this.executeBatch(task, calls, memberById, outputs, [], options.onEvent);
      for (const [memberId, result] of batchResults) {
        outputs[memberId] = result;
        assignments[memberId] = task;
        pending.delete(memberId);
      }
    }

    const final = outputs[finalMember];
    if (!final) throw new Error("专家团没有产出最终结果");
    return {
      task,
      final,
      outputs,
      dispatch: {
        selectedMembers: team.spec.steps.map((step) => step.member),
        skippedMembers: [],
        assignments,
        rationale: "未提供统筹 Agent，按专家团声明执行全部步骤",
      },
    };
  }

  /** 每轮把已完成结果交给统筹 Agent，由它决定下一批调用或永久跳过的成员。 */
  private async runWithCoordinator(
    team: TeamManifest,
    task: string,
    memberById: ReadonlyMap<string, TeamMember>,
    finalMember: string,
    options: TeamRunOptions,
  ): Promise<TeamRunResult> {
    const pending = new Map(team.spec.steps.map((step) => [step.member, step]));
    const resolved = new Set<string>();
    const outputs: Record<string, ExpertResult> = Object.create(null) as Record<string, ExpertResult>;
    const selectedMembers = new Set<string>();
    const skippedMembers = new Set<string>();
    const assignments: Record<string, string> = Object.create(null) as Record<string, string>;
    const rationale: string[] = [];

    while (pending.size > 0) {
      const availableMembers = [...pending.values()]
        .filter((step) => (step.dependsOn ?? []).every((dependency) => resolved.has(dependency)))
        .map((step) => step.member);
      const plan = await options.coordinator!({
        task,
        team,
        candidates: team.spec.steps.map((step) => ({
          member: memberById.get(step.member)!,
          expert: this.registry.getExpert(memberById.get(step.member)!.expert),
          dependsOn: step.dependsOn ?? [],
        })),
        completed: outputs,
        dispatched: [...selectedMembers],
        skipped: [...skippedMembers],
        availableMembers,
      });
      this.validateDispatchPlan(plan, team, pending, new Set(availableMembers), finalMember);
      rationale.push(plan.rationale.trim());

      for (const memberId of plan.skipMembers) {
        const member = memberById.get(memberId);
        if (!member) throw new Error(`步骤找不到成员：${memberId}`);
        pending.delete(memberId);
        resolved.add(memberId);
        skippedMembers.add(memberId);
        this.emit(options.onEvent, { type: "step_skipped", member: member.id, role: member.role, reason: "统筹 Agent 判定该专家当前不需要" });
      }

      const batchResults = await this.executeBatch(task, plan.calls, memberById, outputs, [...skippedMembers], options.onEvent);
      for (const [memberId, result] of batchResults) {
        outputs[memberId] = result;
        assignments[memberId] = plan.calls.find((call) => call.member === memberId)!.task;
        pending.delete(memberId);
        resolved.add(memberId);
        selectedMembers.add(memberId);
      }

      // 最终步骤完成后，剩余候选不再需要调用，避免为了清空队列再次询问统筹 Agent。
      if (outputs[finalMember]) {
        for (const memberId of pending.keys()) {
          const member = memberById.get(memberId);
          if (!member) continue;
          pending.delete(memberId);
          skippedMembers.add(memberId);
          this.emit(options.onEvent, { type: "step_skipped", member: member.id, role: member.role, reason: "最终结果已生成，未再调用" });
        }
        if (pending.size === 0) rationale.push("最终步骤已完成，剩余成员未调用");
      }
    }

    const final = outputs[finalMember];
    if (!final) throw new Error("统筹 Agent 没有调用最终步骤，专家团无法产出最终结果");
    return {
      task,
      final,
      outputs,
      dispatch: {
        selectedMembers: team.spec.steps.map((step) => step.member).filter((member) => selectedMembers.has(member)),
        skippedMembers: team.spec.steps.map((step) => step.member).filter((member) => skippedMembers.has(member)),
        assignments,
        rationale: rationale.join("\n"),
      },
    };
  }

  /** 校验统筹 Agent 的结构化输出，阻止越权成员、重复调用和不可执行时机。 */
  private validateDispatchPlan(
    plan: TeamDispatchPlan,
    team: TeamManifest,
    pending: ReadonlyMap<string, TeamManifest["spec"]["steps"][number]>,
    available: ReadonlySet<string>,
    finalMember: string,
  ): void {
    if (!plan || !Array.isArray(plan.calls) || !Array.isArray(plan.skipMembers)) {
      throw new Error("统筹 Agent 必须返回 calls、skipMembers 和 rationale");
    }
    if (typeof plan.rationale !== "string" || plan.rationale.trim().length === 0) {
      throw new Error("统筹 Agent 必须返回非空 rationale");
    }
    if (plan.calls.length === 0 && plan.skipMembers.length === 0) {
      throw new Error("统筹 Agent 必须安排下一批专家或明确跳过专家");
    }

    const knownMembers = new Set(team.spec.steps.map((step) => step.member));
    const decisions = [...plan.calls.map((call) => call?.member), ...plan.skipMembers];
    if (decisions.some((member) => typeof member !== "string" || !knownMembers.has(member))) {
      throw new Error("统筹 Agent 选择了不存在的步骤成员");
    }
    if (new Set(decisions).size !== decisions.length) {
      throw new Error("统筹 Agent 不能在同一轮重复调用或跳过同一个步骤成员");
    }
    if (plan.skipMembers.includes(finalMember)) {
      throw new Error("统筹 Agent 不能跳过最终集成步骤");
    }
    for (const call of plan.calls) {
      if (!call || typeof call.task !== "string" || call.task.trim().length === 0) {
        throw new Error("统筹 Agent 的每个调用都必须包含非空 task");
      }
      if (!pending.has(call.member)) throw new Error(`统筹 Agent 重复调用或跳过已处理成员：${call.member}`);
      if (!available.has(call.member)) throw new Error(`统筹 Agent 在依赖完成前调用成员：${call.member}`);
    }
    for (const member of plan.skipMembers) {
      if (!pending.has(member)) throw new Error(`统筹 Agent 重复跳过或跳过已处理成员：${member}`);
    }
  }

  /** 同一轮的专家并行执行；每个专家同时收到完整任务和统筹分配的子任务。 */
  private async executeBatch(
    task: string,
    calls: readonly TeamDispatchCall[],
    memberById: ReadonlyMap<string, TeamMember>,
    completed: Readonly<Record<string, ExpertResult>>,
    skipped: readonly string[],
    handler: TeamRunOptions["onEvent"],
  ): Promise<readonly (readonly [string, ExpertResult])[]> {
    return Promise.all(calls.map(async (call) => {
      const member = memberById.get(call.member);
      if (!member) throw new Error(`步骤找不到成员：${call.member}`);
      const eventBase = { member: member.id, role: member.role, task: call.task };
      this.emit(handler, { type: "step_started", ...eventBase });

      try {
        const result = await this.executor({
          task,
          assignment: call.task,
          member,
          expert: this.registry.getExpert(member.expert),
          completed,
          skipped,
        });
        if (result.status === "failed") throw new Error(result.content || "专家执行失败");
        this.emit(handler, { type: "step_completed", member: member.id, role: member.role, content: result.content });
        return [member.id, result] as const;
      } catch (error) {
        const message = error instanceof Error ? error.message : "未知执行错误";
        this.emit(handler, { type: "step_failed", member: member.id, role: member.role, error: message });
        throw error;
      }
    }));
  }

  private emit(handler: ((event: TeamRunEvent) => void) | undefined, event: TeamRunEvent): void {
    handler?.(event);
  }

  /** 只把真实完成结果视为已完成，避免特殊成员 ID 触发对象原型属性。 */
  private hasOutput(outputs: Readonly<Record<string, ExpertResult>>, memberId: string): boolean {
    return Object.prototype.hasOwnProperty.call(outputs, memberId);
  }
}
