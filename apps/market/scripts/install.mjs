import { resolve } from "node:path";
import { catalogue } from "../src/catalogue.js";
import { installHostSkill } from "../../../packages/core/src/host-exporter.ts";

const hosts = ["codex", "dsh", "claude-code"];
const scopes = ["project", "global"];

const help = `
Expert Market Skill 安装器

用法：
  pnpm expert:install -- --list
  pnpm expert:install -- --host codex --id expert.unity-project-architect
  pnpm expert:install -- --host dsh --id team.unity-development --scope global
  pnpm expert:install -- --host claude-code --id team.unity-game-production --dest ./.claude/skills

参数：
  --list                 列出当前市场的专家和专家团 ID
  --host <host>          codex、dsh 或 claude-code
  --id <id>              专家或专家团的 metadata.id
  --scope <scope>        project（默认）或 global
  --dest <path>          自定义 Skill 根目录，优先于 host 和 scope
  --force                显式覆盖同名已有 SKILL.md
  --help                 显示帮助
`;

function parseArgs(argv) {
  const options = { scope: "project" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") continue;
    if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument === "--list") options.list = true;
    else if (argument === "--force") options.force = true;
    else if (argument.startsWith("--")) {
      const key = argument.slice(2);
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`参数 ${argument} 需要一个值`);
      options[key] = value;
      index += 1;
    } else {
      throw new Error(`未知参数：${argument}`);
    }
  }
  return options;
}

function printCatalogue() {
  for (const entry of catalogue) {
    console.log(`${entry.kind === "team" ? "team" : "expert"}\t${entry.manifest.metadata.id}\t${entry.manifest.metadata.name}`);
  }
}

function requireOption(options, key) {
  const value = options[key];
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`缺少 --${key}`);
  return value.trim();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(help);
    return;
  }
  if (options.list) {
    printCatalogue();
    return;
  }

  const host = requireOption(options, "host");
  if (!hosts.includes(host)) throw new Error(`--host 必须是：${hosts.join("、")}`);
  const scope = options.scope;
  if (!scopes.includes(scope)) throw new Error(`--scope 必须是 project 或 global`);
  const id = requireOption(options, "id");
  const entry = catalogue.find((candidate) => candidate.manifest.metadata.id === id);
  if (!entry) throw new Error(`市场找不到 ID：${id}；先运行 --list 查看可用 ID`);

  const experts = new Map(
    catalogue
      .filter((candidate) => candidate.kind === "expert")
      .map((candidate) => [candidate.manifest.metadata.id, candidate.manifest]),
  );
  const result = await installHostSkill(entry.manifest, experts, {
    host,
    scope,
    destination: options.dest ? resolve(options.dest) : undefined,
    force: Boolean(options.force),
  });
  console.log(`已安装 ${result.id} -> ${result.filePath}`);
  console.log("宿主会在下一次任务加载对应 Skill；团队 Skill 已内嵌成员职责和协作顺序。" );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
