import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const files = (await readdir(root)).filter((file) => file.endsWith(".ts"));
const node = process.execPath;

for (const file of files) {
  await new Promise((resolve, reject) => {
    const child = spawn(node, ["--experimental-strip-types", "--check", join(root, file)], { stdio: "inherit" });
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`语法检查失败：${file}`)));
  });
}

console.log(`核心包已检查 ${files.length} 个 TypeScript 文件`);
