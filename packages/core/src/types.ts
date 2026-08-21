/** 专家包的最小声明。模型、密钥和工具由宿主运行时提供。 */
export interface ExpertManifest {
  apiVersion: "expert/v1";
  kind: "expert";
  metadata: {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    tags: string[];
  };
  spec: {
    instructions: string;
    capabilities: string[];
  };
}

/** 专家团成员只保存角色与专家引用，避免复制专家配置。 */
export interface TeamMember {
  id: string;
  expert: string;
  role: string;
}

/** 步骤依赖成员 ID；它是统筹调度的安全边界，不代表每次任务都必须调用。 */
export interface TeamStep {
  member: string;
  dependsOn?: string[];
}

/** 专家团定义；steps 声明候选分支，最后一个步骤默认为最终集成输出。 */
export interface TeamManifest {
  apiVersion: "expert/v1";
  kind: "team";
  metadata: {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    tags: string[];
  };
  spec: {
    members: TeamMember[];
    steps: TeamStep[];
  };
}

/** 统筹 Agent 选择专家时看到的候选信息；工具权限仍由宿主注入。 */
export interface TeamCandidate {
  member: TeamMember;
  expert: ExpertManifest;
  dependsOn: readonly string[];
}

/** 统筹 Agent 的每轮输入；不把模型、密钥或工具配置写入专家团。 */
export interface TeamCoordinationInput {
  task: string;
  team: TeamManifest;
  candidates: readonly TeamCandidate[];
  completed: Readonly<Record<string, ExpertResult>>;
  dispatched: readonly string[];
  skipped: readonly string[];
  availableMembers: readonly string[];
}

/** 统筹 Agent 在一轮中下发的一个专家子任务。 */
export interface TeamDispatchCall {
  member: string;
  task: string;
}

/** 统筹 Agent 的结构化分发结果；同一轮 calls 并行，下一轮等待结果后再规划。 */
export interface TeamDispatchPlan {
  calls: TeamDispatchCall[];
  skipMembers: string[];
  rationale: string;
}

/** 由宿主提供的统筹 Agent；每个调度轮次调用一次。 */
export type TeamCoordinator = (input: TeamCoordinationInput) => Promise<TeamDispatchPlan>;

/** 运行结果中的分发记录，用于审计实际调用和跳过的专家。 */
export interface TeamDispatchResult {
  selectedMembers: readonly string[];
  skippedMembers: readonly string[];
  assignments: Readonly<Record<string, string>>;
  rationale: string;
}

export interface ExpertResult {
  content: string;
  status: "completed" | "failed";
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface ExpertExecutionInput {
  /** 用户提交的完整任务。 */
  task: string;
  /** 统筹 Agent 为当前专家分配的子任务；未启用统筹时等于完整任务。 */
  assignment: string;
  member: TeamMember;
  expert: ExpertManifest;
  completed: Readonly<Record<string, ExpertResult>>;
  /** 本次任务中被统筹 Agent 永久跳过、因此没有结果可交接的成员。 */
  skipped: readonly string[];
}

export type ExpertExecutor = (input: ExpertExecutionInput) => Promise<ExpertResult>;

export type TeamRunEvent =
  | { type: "step_started"; member: string; role: string; task: string }
  | { type: "step_completed"; member: string; role: string; content: string }
  | { type: "step_skipped"; member: string; role: string; reason: string }
  | { type: "step_failed"; member: string; role: string; error: string };

export interface TeamRunOptions {
  onEvent?: (event: TeamRunEvent) => void;
  coordinator?: TeamCoordinator;
}

export interface TeamRunResult {
  task: string;
  final: ExpertResult;
  outputs: Readonly<Record<string, ExpertResult>>;
  dispatch: TeamDispatchResult;
}
