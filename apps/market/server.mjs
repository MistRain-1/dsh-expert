import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const workspaceRoot = resolve(root, "..", "..");
const mimeTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
const port = Number(process.env.EXPERT_MARKET_PORT ?? 4173);

function json(response, payload) {
  response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(payload));
}

function skillRoots() {
  const home = process.env.USERPROFILE ?? process.env.HOME;
  return [
    home ? { host: "codex", scope: "global", path: resolve(home, ".codex", "skills") } : null,
    home ? { host: "dsh", scope: "global", path: resolve(home, ".dsh", "skills") } : null,
    home ? { host: "claude-code", scope: "global", path: resolve(home, ".claude", "skills") } : null,
    { host: "codex", scope: "project", path: resolve(workspaceRoot, ".codex", "skills") },
    { host: "dsh", scope: "project", path: resolve(workspaceRoot, ".dsh", "skills") },
    { host: "claude-code", scope: "project", path: resolve(workspaceRoot, ".claude", "skills") },
    { host: "codex", scope: "project", path: resolve(process.cwd(), ".codex", "skills") },
    { host: "dsh", scope: "project", path: resolve(process.cwd(), ".dsh", "skills") },
    { host: "claude-code", scope: "project", path: resolve(process.cwd(), ".claude", "skills") },
  ].filter(Boolean);
}

async function readInstalledSkills() {
  const records = [];
  for (const rootRecord of skillRoots()) {
    let directories;
    try {
      directories = await readdir(rootRecord.path, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const directory of directories) {
      if (!directory.isDirectory()) continue;
      const filePath = resolve(rootRecord.path, directory.name, "SKILL.md");
      try {
        const stat = await readFile(filePath, "utf8");
        const nameMatch = stat.match(/^name:\s*['\"]?([^'\"\r\n]+)['\"]?/m);
        records.push({
          host: rootRecord.host,
          scope: rootRecord.scope,
          directory: directory.name,
          name: nameMatch?.[1]?.trim() || directory.name,
        });
      } catch {
        // Ignore incomplete directories; the CLI installer remains authoritative.
      }
    }
  }
  return records.sort((left, right) => `${left.host}-${left.scope}-${left.name}`.localeCompare(`${right.host}-${right.scope}-${right.name}`));
}

const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent((request.url ?? "/").split("?")[0]);
  if (requestPath === "/api/installed-skills") {
    json(response, { skills: await readInstalledSkills() });
    return;
  }
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Expert Market running at http://127.0.0.1:${port}`));
