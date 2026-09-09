// 把市场目录全部专家与专家团批量安装到 DSH 全局 Skill 目录。
import { catalogue } from "./apps/market/src/catalogue.js";
import { installHostSkill } from "./packages/core/src/host-exporter.ts";

const experts = new Map(
  catalogue.filter((e) => e.kind === "expert").map((e) => [e.manifest.metadata.id, e.manifest]),
);

let installed = 0;
let skipped = 0;
let failed = 0;
const failures = [];
for (const entry of catalogue) {
  try {
    const result = await installHostSkill(entry.manifest, experts, { host: "dsh", scope: "global" });
    installed += 1;
    console.log("OK   " + result.id + " -> " + result.filePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("已存在")) {
      skipped += 1;
      console.log("SKIP " + entry.manifest.metadata.id + "（已存在，未覆盖）");
    } else {
      failed += 1;
      failures.push(entry.manifest.metadata.id + ": " + message);
    }
  }
}
console.log("installed:", installed, "| skipped:", skipped, "| failed:", failed);
if (failures.length) {
  console.log("FAILURES:");
  failures.forEach((f) => console.log("  " + f));
  process.exitCode = 1;
}
