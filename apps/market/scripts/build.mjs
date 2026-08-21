import { access } from "node:fs/promises";
import { catalogue } from "../src/catalogue.js";

for (const file of ["../index.html", "../src/main.js", "../src/catalogue.js", "../src/styles.css", "../../../packages/core/src/index.ts"]) {
  await access(new URL(file, import.meta.url));
}

const experts = catalogue.filter((entry) => entry.kind === "expert");
const ids = catalogue.map((entry) => entry.manifest.metadata.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const requiredSections = ["工作目标：", "输入边界：", "输出格式：", "失败处理：", "安全边界："];
const invalidExperts = experts.filter((entry) => {
  const { manifest, source } = entry;
  return !entry.verified || !source?.repository || !source.path || !source.commit || !source.license
    || requiredSections.some((section) => !manifest.spec.instructions.includes(section));
});

if (experts.length < 20) throw new Error(`市场至少需要 20 个专家，当前只有 ${experts.length} 个`);
if (duplicateIds.length > 0) throw new Error(`市场存在重复 ID：${duplicateIds.join(", ")}`);
if (invalidExperts.length > 0) throw new Error(`专家目录存在不完整条目：${invalidExperts.map((entry) => entry.manifest.metadata.id).join(", ")}`);

console.log(`市场工作台静态资源检查通过：${experts.length} 个专家，${catalogue.length - experts.length} 个专家团`);
