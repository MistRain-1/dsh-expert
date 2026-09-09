import { catalogue as initialCatalogue, createExpert as expert, createTeam as team, item } from "./catalogue.js";

const root = document.querySelector("#root");
let catalogue = initialCatalogue;
let installedSkills = [];
const supportedHosts = ["codex", "dsh", "claude-code"];
const hostLabels = { codex: "Codex", dsh: "DSH", "claude-code": "Claude Code" };

const state = {
  section: "market",
  kind: "all",
  query: "",
  searchMode: "local",
  githubTopic: "",
  githubStatus: "idle",
  githubMessage: "",
  githubResults: [],
  githubSelectedId: "",
  selectedId: "team.general-expert-team",
  modal: null,
  installHost: "dsh",
  installCopied: false,
  installStatus: "loading",
  installMessage: "",
  events: [],
  runState: "idle",
  lastResult: "",
};
let githubSearchController;
const pause = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function isTeam(value) { return value.kind === "team"; }
function escapeHtml(value) { return String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character])); }
function icon(symbol, label = "") { return `<span aria-hidden="true" class="symbol">${symbol}</span>${label ? `<span>${label}</span>` : ""}`; }
function sourceUrl(record) { return record ? `https://github.com/${record.repository}/blob/${record.commit}/${record.path}` : ""; }
function skillNameForId(id) { return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function isInstalled(manifest, host = state.installHost) {
  const skillName = skillNameForId(manifest?.metadata?.id ?? "");
  return Boolean(skillName) && installedSkills.some((skill) => skill.host === host && (skill.name === skillName || skill.directory === skillName));
}
function installedHosts(manifest) { return supportedHosts.filter((host) => isInstalled(manifest, host)); }
function hostLabel(host) { return hostLabels[host] ?? host; }

async function loadInstalledSkills() {
  try {
    const response = await fetch("/api/installed-skills", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    installedSkills = Array.isArray(payload.skills) ? payload.skills : [];
  } catch {
    installedSkills = [];
    state.installStatus = "error";
    state.installMessage = "无法读取本机 Skill 目录";
    render();
    return;
  }
  state.installStatus = "ready";
  state.installMessage = "";
  render();
}

function normalizeTopic(value) {
  return value.trim().replace(/^topic:/i, "").replace(/^#/, "").trim().toLowerCase().replace(/\s+/g, "-");
}

function isValidTopic(topic) { return /^[a-z0-9][a-z0-9-]{0,49}$/.test(topic); }

function formatCount(value) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

function formatDate(value) {
  if (!value) return "未知";
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

function githubRepository(repository) {
  return {
    id: `github:${repository.full_name}`,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description || "该仓库没有提供描述。",
    author: repository.owner?.login || "未知维护者",
    htmlUrl: repository.html_url,
    topics: Array.isArray(repository.topics) ? repository.topics : [],
    stars: repository.stargazers_count ?? 0,
    forks: repository.forks_count ?? 0,
    language: repository.language || "未标注",
    license: repository.license?.spdx_id || "未标注",
    defaultBranch: repository.default_branch || "main",
    updatedAt: repository.updated_at,
    archived: Boolean(repository.archived),
  };
}

/** 直接查询 GitHub 公共搜索接口；不把仓库代码下载或执行到本地。 */
async function searchGithubTopic() {
  const topic = normalizeTopic(state.githubTopic);
  state.githubTopic = topic;

  if (!isValidTopic(topic)) {
    state.githubStatus = "error";
    state.githubMessage = "Topic 只能包含字母、数字和连字符，长度为 1 到 50 个字符。";
    state.githubResults = [];
    state.githubSelectedId = "";
    render();
    return;
  }

  githubSearchController?.abort();
  const controller = new AbortController();
  githubSearchController = controller;
  state.githubStatus = "loading";
  state.githubMessage = `正在从 GitHub 搜索 Topic: ${topic}`;
  state.githubResults = [];
  state.githubSelectedId = "";
  render();

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=topic:${encodeURIComponent(topic)}&sort=stars&order=desc&per_page=12`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      signal: controller.signal,
    });
    const remaining = response.headers.get("x-ratelimit-remaining");
    const resetAt = response.headers.get("x-ratelimit-reset");

    if (response.status === 403 || response.status === 429) {
      const resetText = resetAt ? `，预计 ${formatDate(Number(resetAt) * 1000)} 重置` : "";
      throw new Error(`GitHub 公共 API 已触发限流${resetText}。登录 GitHub 或稍后重试。`);
    }
    if (!response.ok) throw new Error(`GitHub 返回 HTTP ${response.status}。`);

    const payload = await response.json();
    state.githubResults = (payload.items ?? []).map(githubRepository);
    state.githubSelectedId = state.githubResults[0]?.id ?? "";
    state.githubStatus = "success";
    state.githubMessage = `GitHub 返回 ${state.githubResults.length} 个结果${remaining ? ` · 剩余请求 ${remaining}` : ""}`;
  } catch (error) {
    if (error?.name === "AbortError" || githubSearchController !== controller) return;
    state.githubStatus = "error";
    state.githubMessage = error instanceof Error ? error.message : "GitHub 搜索失败，请检查网络后重试。";
  } finally {
    if (githubSearchController === controller) {
      githubSearchController = undefined;
      render();
    }
  }
}

function githubResultsView() {
  if (state.githubStatus === "idle") return `<div class="empty-state github-state">⌕<strong>从 GitHub Topic 开始搜索</strong><span>输入 Topic 后，结果会直接来自 GitHub。</span></div>`;
  if (state.githubStatus === "loading") return `<div class="empty-state github-state">◌<strong>正在搜索 GitHub</strong><span>${escapeHtml(state.githubMessage)}</span></div>`;
  if (state.githubStatus === "error") return `<div class="empty-state github-state">!<strong>GitHub 搜索不可用</strong><span>${escapeHtml(state.githubMessage)}</span><button class="button button-secondary" data-action="retry-github">重试</button></div>`;
  if (state.githubResults.length === 0) return `<div class="empty-state github-state">⌕<strong>没有找到 Topic 项目</strong><span>换一个更具体或更常见的 Topic。</span></div>`;
  return state.githubResults.map(githubCard).join("");
}

function githubCard(repository) {
  const selected = repository.id === state.githubSelectedId;
  return `<button class="catalog-card github-card ${selected ? "selected" : ""}" data-github-select="${escapeHtml(repository.id)}"><div class="card-topline"><div class="type-icon github">GH</div><span class="type-label">GitHub Topic</span>${repository.archived ? "<span class=\"archived-label\">已归档</span>" : ""}<span class="card-more">↗</span></div><h3>${escapeHtml(repository.name)}</h3><p>${escapeHtml(repository.description)}</p><div class="tag-row">${(repository.topics.length ? repository.topics : [state.githubTopic]).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div><div class="github-card-meta"><span>★ ${formatCount(repository.stars)}</span><span>⑂ ${formatCount(repository.forks)}</span><span>${escapeHtml(repository.language)}</span></div><div class="card-footer"><span>${escapeHtml(repository.author)}</span><span class="version">更新于 ${formatDate(repository.updatedAt)}</span></div></button>`;
}

function githubInspector(repository) {
  return `<aside class="inspector github-inspector"><div class="inspector-header"><span>GitHub 仓库</span><button class="icon-button">•••</button></div><div class="inspector-identity"><div class="detail-icon github-detail">GH</div><div><h2>${escapeHtml(repository.name)}</h2><div class="identity-meta">${escapeHtml(repository.fullName)}</div></div></div><p class="detail-description">${escapeHtml(repository.description)}</p><div class="detail-tags">${(repository.topics.length ? repository.topics : [state.githubTopic]).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div><div class="github-stat-grid"><div><small>Stars</small><strong>★ ${formatCount(repository.stars)}</strong></div><div><small>Forks</small><strong>⑂ ${formatCount(repository.forks)}</strong></div><div><small>语言</small><strong>${escapeHtml(repository.language)}</strong></div><div><small>分支</small><strong>${escapeHtml(repository.defaultBranch)}</strong></div></div><div class="github-notice">产品只负责发现仓库。安装或接入前，请检查 README、manifest、许可证和代码权限。</div><a class="button button-primary full-button github-open-button" href="${escapeHtml(repository.htmlUrl)}" target="_blank" rel="noreferrer">↗ 打开 GitHub 仓库</a><a class="github-topic-link" href="https://github.com/topics/${encodeURIComponent(state.githubTopic)}" target="_blank" rel="noreferrer">在 GitHub Topic 页面查看全部结果 ↗</a><div class="inspector-bottom"><div><small>来源</small><strong>GitHub</strong></div><div><small>许可证</small><strong>${escapeHtml(repository.license)}</strong></div><div><small>更新时间</small><strong>${formatDate(repository.updatedAt)}</strong></div></div></aside>`;
}

function render() {
  const normalizedQuery = state.query.trim().toLowerCase();
  const visible = catalogue.filter((entry) => {
    const haystack = [entry.manifest.metadata.name, entry.manifest.metadata.description, ...entry.manifest.metadata.tags].join(" ").toLowerCase();
    return (state.kind === "all" || state.kind === entry.kind) && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
  const selected = catalogue.find((entry) => entry.manifest.metadata.id === state.selectedId) ?? visible[0] ?? catalogue[0];
  const githubSelected = state.githubResults.find((repository) => repository.id === state.githubSelectedId);
  const isGithubSearch = state.searchMode === "github-topic";
  const counts = { all: catalogue.length, expert: catalogue.filter((entry) => entry.kind === "expert").length, team: catalogue.filter((entry) => entry.kind === "team").length };
  const installedCount = state.installStatus === "ready" ? catalogue.filter((entry) => isInstalled(entry.manifest, "dsh")).length : "-";
  root.innerHTML = `<div class="app-shell">
    <aside class="sidebar">
      <div class="brand-lockup"><div class="brand-mark"><span>EX</span></div><div><strong>EXPERT</strong><small>OPEN MARKET</small></div></div>
      <div class="workspace-switcher"><span class="workspace-dot"></span><div><small>当前工作区</small><strong>atlas-lab</strong></div><span>›</span></div>
      <nav class="primary-nav" aria-label="主导航"><button class="nav-button ${state.section === "market" ? "active" : ""}" data-action="market">${icon("⊞", "专家市场")}${state.section === "market" ? "<i></i>" : ""}</button><button class="nav-button ${state.section === "workspace" ? "active" : ""}" data-action="workspace">${icon("◌", "我的工作台")}${state.section === "workspace" ? "<i></i>" : ""}</button><button class="nav-button ${state.section === "teams" ? "active" : ""}" data-action="teams">${icon("⌘", "专家团")}${state.section === "teams" ? "<i></i>" : ""}</button></nav>
      <div class="side-divider"></div><div class="side-label">收藏与管理</div>
      <button class="side-link">${icon("⌁", "我的发布")}<span>3</span></button><button class="side-link">${icon("✓", "审核队列")}<span>8</span></button><button class="side-link">${icon("□", "已安装")}<span>${installedCount}</span></button>
      <div class="sidebar-footer"><div class="sync-status"><span></span> Registry 已同步</div><div class="user-row"><div class="avatar">AL</div><div><strong>Atlas Lab</strong><small>开源维护者</small></div><span>•••</span></div></div>
    </aside>
    <main class="main-area"><header class="topbar"><div class="breadcrumb"><span>WORKSPACE</span><span>›</span><strong>${state.section === "teams" ? "专家团" : state.section === "workspace" ? "我的工作台" : "专家市场"}</strong></div><div class="top-actions"><button class="icon-button" aria-label="活动记录">◷</button><div class="notification-dot"></div><button class="avatar avatar-small">AL</button></div></header>
      <div class="page-content"><section class="page-heading"><div><div class="eyebrow">OPEN EXPERT ECOSYSTEM <span>·</span> v0.1</div><h1>把能力组合起来，<em>让专家协作。</em></h1><p>发现可复用的专家，组建有明确分工的专家团，把一次性提示词变成可验证的工作流。</p></div><div class="heading-actions"><button class="button button-secondary" data-action="publish">⇧ <span>发布专家</span></button><button class="button button-primary" data-action="create-team">+ <span>创建专家团</span></button></div></section>
      <section class="signal-strip"><div class="signal-main"><div class="signal-icon">⌘</div><div><strong>自定义专家团</strong><span>把研究、审查、写作连接成一条可观测的协作链。</span></div><span>↗</span></div><div class="signal-stats"><div><strong>1,248</strong><span>已发布专家</span></div><div><strong>316</strong><span>公开专家团</span></div><div><strong>99.2%</strong><span>运行可追溯</span></div></div></section>
      <div class="toolbar"><div class="toolbar-left"><div class="source-tabs"><button class="${!isGithubSearch ? "active" : ""}" data-source="local">本地目录</button><button class="${isGithubSearch ? "active" : ""}" data-source="github-topic">GitHub Topic</button></div>${!isGithubSearch ? `<div class="tabs"><button class="${state.kind === "all" ? "active" : ""}" data-kind="all">全部 <span>${counts.all}</span></button><button class="${state.kind === "expert" ? "active" : ""}" data-kind="expert">专家 <span>${counts.expert}</span></button><button class="${state.kind === "team" ? "active" : ""}" data-kind="team">专家团 <span>${counts.team}</span></button></div>` : ""}</div><div class="toolbar-actions">${isGithubSearch ? `<form class="topic-search-form" data-topic-form><label class="search-box">⌕ <input data-search aria-label="搜索 GitHub Topic" value="${escapeHtml(state.githubTopic)}" placeholder="输入 Topic，例如 agent-skills" /></label><button class="topic-search-button" type="submit">搜索</button></form>` : `<label class="search-box">⌕ <input data-search aria-label="搜索专家、能力或标签" value="${escapeHtml(state.query)}" placeholder="搜索专家、能力或标签" /></label><button class="filter-button">☷ 筛选</button>`}</div></div>
      <div class="content-grid"><section class="catalog-grid" aria-label="${isGithubSearch ? "GitHub Topic 搜索结果" : "专家目录"}">${isGithubSearch ? githubResultsView() : visible.length ? visible.map(card).join("") : `<div class="empty-state">⌕<strong>没有匹配结果</strong><span>试试更短的关键词，或切换到全部。</span></div>`}</section>${isGithubSearch ? githubSelected ? githubInspector(githubSelected) : "" : selected ? inspector(selected) : ""}</div></div>
    </main></div>${state.modal ? modal() : ""}`;
}

function card(entry) {
  const manifest = entry.manifest; const teamEntry = isTeam(entry); const selected = manifest.metadata.id === state.selectedId;
  const members = teamEntry ? manifest.spec.members : [];
  const installed = state.installStatus === "ready" && isInstalled(manifest, "dsh");
  return `<button class="catalog-card ${selected ? "selected" : ""} ${installed ? "is-installed" : ""}" data-select="${escapeHtml(manifest.metadata.id)}"><div class="card-topline"><div class="type-icon ${entry.accent}">${teamEntry ? "⌘" : "◉"}</div><span class="type-label">${teamEntry ? "专家团" : "专家"}</span>${entry.verified ? `<span class="verified-badge" aria-label="已审核">✓ 已审核</span>` : ""}${installed ? `<span class="card-installed"><span>✓</span> 已安装</span>` : ""}<span class="card-more">•••</span></div><h3>${escapeHtml(manifest.metadata.name)}</h3><p>${escapeHtml(manifest.metadata.description)}</p><div class="tag-row">${manifest.metadata.tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>${teamEntry ? `<div class="member-stack">${members.slice(0, 4).map((member, index) => `<span class="mini-avatar mini-${index}">${escapeHtml(member.role.slice(0, 1))}</span>`).join("")}<small>${members.length} 位专家协作</small></div>` : ""}<div class="card-footer"><span>♧ ${entry.installs}</span><span><span class="star">★</span> ${entry.rating}</span><span class="version">v${manifest.metadata.version}</span></div></button>`;
}

function inspector(entry) {
  const manifest = entry.manifest; const teamEntry = isTeam(entry); const ready = teamEntry && manifest.spec.members.length > 0 && manifest.spec.steps.length > 0;
  const sourceRecord = entry.source;
  const sourceBlock = sourceRecord ? `<div class="source-block"><small>提示词来源</small><a href="${escapeHtml(sourceUrl(sourceRecord))}" target="_blank" rel="noreferrer">${escapeHtml(sourceRecord.repository)} / ${escapeHtml(sourceRecord.path)} ↗</a><span>固定 commit ${escapeHtml(sourceRecord.commit.slice(0, 8))} · ${escapeHtml(sourceRecord.license)}</span></div>` : "";
  return `<aside class="inspector"><div class="inspector-header"><span>详细信息</span><button class="icon-button" aria-label="更多信息">•••</button></div><div class="inspector-identity"><div class="detail-icon ${entry.accent}">${teamEntry ? "⌘" : "◉"}</div><div><h2>${escapeHtml(manifest.metadata.name)}</h2><div class="identity-meta">${teamEntry ? "专家团" : "专家"} · ${escapeHtml(manifest.metadata.author)}</div></div></div><p class="detail-description">${escapeHtml(manifest.metadata.description)}</p><div class="detail-tags">${manifest.metadata.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>${sourceBlock}${teamEntry ? teamFlow(manifest) : capabilityList(manifest)}${installAction(manifest)}${teamEntry ? runPanel(manifest, ready) : ""}<div class="inspector-bottom"><div><small>发布版本</small><strong>v${manifest.metadata.version}</strong></div><div><small>许可证</small><strong>${escapeHtml(sourceRecord?.license ?? "本地")}</strong></div><div><small>状态</small><strong class="status-live"><span></span> 可用</strong></div></div></aside>`;
}

function installAction(manifest) {
  const installed = state.installStatus === "ready" && isInstalled(manifest);
  const allHostsInstalled = state.installStatus === "ready" && installedHosts(manifest).length === supportedHosts.length;
  if (state.installStatus === "loading") return `<div class="install-panel"><div class="section-title"><span>安装到 Agent</span><small>CHECKING</small></div><p>正在读取本机宿主目录的安装状态。</p><button class="button button-secondary full-button" disabled>◌ 检查安装状态…</button></div>`;
  if (installed) return `<div class="install-panel is-installed"><div class="section-title"><span>已安装到 ${hostLabel(state.installHost)}</span><small>READY</small></div><p>这个 Skill 已经在当前宿主目录中，可以直接使用；重复安装已关闭。</p><div class="installed-state"><span class="installed-check">✓</span><div><strong>本机已发现</strong><small>${escapeHtml(skillNameForId(manifest.metadata.id))} · ${escapeHtml(hostLabel(state.installHost))}</small></div></div>${allHostsInstalled ? "" : `<button class="button button-secondary full-button" data-action="install-other">选择其他宿主</button>`}</div>`;
  if (state.installStatus === "error") return `<div class="install-panel"><div class="section-title"><span>安装到 Agent</span><small>UNVERIFIED</small></div><p>无法读取本机安装目录；请先在目标宿主确认是否已有同名 Skill。</p><button class="button button-primary full-button" data-action="install">⇩ 选择宿主并安装</button></div>`;
  return `<div class="install-panel"><div class="section-title"><span>安装到 ${hostLabel(state.installHost)}</span><small>CLI</small></div><p>浏览器不会直接写入文件。复制命令后，在项目根目录运行即可生成宿主可识别的 SKILL.md。</p><button class="button button-primary full-button" data-action="install">⇩ 选择宿主并安装</button></div>`;
}

function teamFlow(manifest) {
  const finalMember = manifest.spec.steps.at(-1)?.member;
  return `<div class="team-flow"><div class="section-title"><span>候选调度边界</span><small>${manifest.spec.members.length} 位成员</small></div>${manifest.spec.steps.map((step, index) => { const member = manifest.spec.members.find((candidate) => candidate.id === step.member); const dependencyText = step.dependsOn?.length ? `前置：${step.dependsOn.join("、")}` : "首轮候选"; const finalText = step.member === finalMember ? " · 最终集成" : ""; return `<div class="flow-step"><div class="flow-index">0${index + 1}</div><div class="flow-copy"><strong>${escapeHtml(member?.role ?? step.member)}</strong><span>${escapeHtml(member?.expertName ?? member?.expert ?? "待配置")} · ${escapeHtml(dependencyText)}${finalText}</span></div>${index < manifest.spec.steps.length - 1 ? "›" : ""}</div>`; }).join("")}</div>`;
}

function capabilityList(manifest) { return `<div class="capability-list"><div class="section-title"><span>能力范围</span><small>${manifest.spec.capabilities.length} 项</small></div>${manifest.spec.capabilities.map((capability) => `<div class="capability">✓ ${escapeHtml(capability)}</div>`).join("")}</div>`; }

function runPanel(manifest, ready) {
  const eventLines = state.events.map((event) => { const label = event.type === "step_started" ? "候选步骤开始" : event.type === "step_completed" ? "依赖检查完成" : event.type === "step_skipped" ? "候选步骤跳过" : "依赖检查失败"; return `<div class="event-line ${event.type}"><span class="event-dot"></span><div><strong>${escapeHtml(event.role)}</strong><span>${label}</span></div></div>`; }).join("");
  return `<div class="run-panel"><div class="section-title"><span>依赖边界预览</span>${state.runState === "done" ? "<small class=\"success-text\">预览完成</small>" : ""}</div>${!ready ? "<p>这个专家团还没有成员或步骤，请先从市场添加专家并配置候选边界。</p>" : state.events.length === 0 && state.runState === "idle" ? "<p>这里只检查声明的依赖层，不调用统筹模型、专家、Unity 或宿主工具；真实运行由宿主统筹 Agent 决定按需调用。</p>" : `<div class="event-stream">${eventLines}</div>`}${state.lastResult ? `<div class="run-result"><small>预览结果</small><span>${escapeHtml(state.lastResult)}</span></div>` : ""}<button class="button button-primary full-button" data-action="run" ${!ready || state.runState === "running" ? "disabled" : ""}>▶ ${state.runState === "running" ? "预览中…" : "预览候选依赖"}</button>${state.runState === "error" ? "<small class=\"error-text\">预览失败，请检查成员依赖。</small>" : ""}</div>`;
}

function installModal() {
  const entry = catalogue.find((candidate) => candidate.manifest.metadata.id === state.selectedId);
  if (!entry) return "";
  const installed = isInstalled(entry.manifest, state.installHost);
  const id = entry.manifest.metadata.id;
  const command = `pnpm expert:install -- --host ${state.installHost} --id ${id}`;
  const options = supportedHosts.map((host) => `<option value="${host}" ${state.installHost === host ? "selected" : ""} ${isInstalled(entry.manifest, host) ? "disabled" : ""}>${hostLabel(host)}${isInstalled(entry.manifest, host) ? " · 已安装" : ""}</option>`).join("");
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><div class="eyebrow">HOST INSTALL</div><h2 id="modal-title">安装 ${escapeHtml(entry.manifest.metadata.name)}</h2><p>选择尚未安装的目标宿主，复制命令后在 Expert Market 项目根目录运行。已有 Skill 不会重复覆盖。</p></div><button class="icon-button" aria-label="关闭" data-action="close-modal">×</button></div><div class="form-stack"><label>目标 Agent<select id="install-host">${options}</select></label>${installed ? `<div class="installed-state modal-installed"><span class="installed-check">✓</span><div><strong>${hostLabel(state.installHost)} 已安装</strong><small>请选择其他未安装宿主</small></div></div>` : `<div class="install-command"><small>项目级安装命令</small><code>${escapeHtml(command)}</code></div>`}<div class="upload-note">✓ <span>专家团会生成一个自包含 SKILL.md；成员提示词、动态统筹协议、候选依赖边界和安全边界都会写入文件。</span></div><div class="modal-actions"><button class="button button-secondary" data-action="close-modal">取消</button><button class="button button-primary" data-action="copy-install-command" ${installed ? "disabled" : ""}>${state.installCopied ? "已复制" : installed ? "已安装" : "复制命令"}</button></div></div></div></div>`;
}

function modal() {
  if (state.modal === "install") return installModal();
  if (state.modal === "publish") return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><div class="eyebrow">LOCAL WORKSPACE</div><h2 id="modal-title">发布一个专家</h2><p>发布会先进入本地审核队列，不会直接执行上传者代码。</p></div><button class="icon-button" data-action="close-modal">×</button></div><div class="form-stack"><label>专家名称<input id="publish-name" placeholder="例如：增长策略顾问" autofocus /></label><label>职责描述<textarea id="publish-description" placeholder="它解决什么问题？不应该做什么？" rows="4"></textarea></label><div class="upload-note">✓ <span>专家包只声明 instructions 与 capabilities，模型、密钥和工具权限由宿主控制。</span></div><div class="modal-actions"><button class="button button-secondary" data-action="close-modal">取消</button><button class="button button-primary" data-action="submit-publish">⇧ 提交审核</button></div></div></div></div>`;
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><div class="eyebrow">LOCAL WORKSPACE</div><h2 id="modal-title">创建专家团</h2><p>先创建协作容器，再从市场选择候选专家并配置依赖边界。</p></div><button class="icon-button" data-action="close-modal">×</button></div><div class="form-stack"><label>专家团名称<input id="team-name" placeholder="例如：竞品研究小组" autofocus /></label><div class="builder-preview"><div class="builder-title">⌁ 协作画布</div><div class="builder-node"><span>01</span><strong>添加第一个候选专家</strong><small>研究、规划或执行</small></div><div class="builder-line"></div><div class="builder-node muted"><span>02</span><strong>继续添加角色</strong><small>依赖边界和调用时机由统筹 Agent 决定</small></div></div><div class="modal-actions"><button class="button button-secondary" data-action="close-modal">取消</button><button class="button button-primary" data-action="submit-team">+ 创建工作区</button></div></div></div></div>`;
}

async function runSelected() {
  const selected = catalogue.find((entry) => entry.manifest.metadata.id === state.selectedId);
  if (!selected || !isTeam(selected) || !selected.manifest.spec.steps.length || state.runState === "running") return;
  state.runState = "running"; state.events = []; state.lastResult = ""; render();
    const outputs = Object.create(null);
  try {
    const pending = new Map(selected.manifest.spec.steps.map((step) => [step.member, step]));
    while (pending.size) {
      const ready = [...pending.values()].filter((step) => (step.dependsOn ?? []).every((dependency) => dependency in outputs));
      if (!ready.length) throw new Error("循环依赖");
      for (const step of ready) {
        const member = selected.manifest.spec.members.find((candidate) => candidate.id === step.member);
        state.events.push({ type: "step_started", member: member.id, role: member.role }); render(); await pause(360);
        const content = `本地依赖预览：${member.role} 已完成候选节点检查；未调用模型、Unity 或宿主工具。`;
        outputs[member.id] = { content, status: "completed" }; state.events.push({ type: "step_completed", member: member.id, role: member.role, content }); pending.delete(member.id); render();
      }
    }
    state.lastResult = outputs[selected.manifest.spec.steps.at(-1).member].content; state.runState = "done"; render();
  } catch { state.runState = "error"; render(); }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-kind], [data-select], [data-source], [data-github-select]"); if (!target) return;
  // 弹窗内部点击不能被背景层的关闭动作误判为点击遮罩。
  if (target.classList.contains("modal-backdrop") && event.target !== target) return;
  if (target.dataset.select) { state.selectedId = target.dataset.select; state.events = []; state.runState = "idle"; state.lastResult = ""; render(); return; }
  if (target.dataset.githubSelect) { state.githubSelectedId = target.dataset.githubSelect; render(); return; }
  if (target.dataset.source) {
    state.searchMode = target.dataset.source;
    if (state.searchMode === "github-topic") state.section = "market";
    render();
    return;
  }
  if (target.dataset.kind) { state.kind = target.dataset.kind; render(); return; }
  const action = target.dataset.action;
  if (action === "market") { state.section = "market"; state.kind = "all"; state.searchMode = "local"; }
  if (action === "workspace") { state.section = "workspace"; state.searchMode = "local"; }
  if (action === "teams") { state.section = "teams"; state.kind = "team"; state.searchMode = "local"; }
  if (action === "publish" || action === "create-team") state.modal = action === "publish" ? "publish" : "team";
  if (action === "install" || action === "install-other") { const selectedManifest = catalogue.find((candidate) => candidate.manifest.metadata.id === state.selectedId)?.manifest; if (!selectedManifest || (action === "install" && state.installStatus === "ready" && isInstalled(selectedManifest))) return; state.modal = "install"; state.installCopied = false; }
  if (action === "close-modal") state.modal = null;
  if (action === "retry-github") { searchGithubTopic(); return; }
  if (action === "run") { runSelected(); return; }
  if (action === "copy-install-command") { copyInstallCommand(); return; }
  if (action === "submit-publish") { const name = document.querySelector("#publish-name")?.value.trim(); const description = document.querySelector("#publish-description")?.value.trim(); if (!name || !description) return; const id = `expert.local-${Date.now()}`; const manifest = expert(id, name, description, "本地工作区", ["待审核"], ["待配置"]); manifest.metadata.version = "0.1.0"; catalogue.unshift(item("expert", manifest, "0", "—", "blue")); state.selectedId = id; state.modal = null; }
  if (action === "submit-team") { const name = document.querySelector("#team-name")?.value.trim(); if (!name) return; const id = `team.local-${Date.now()}`; const manifest = team(id, name, "由本地工作区创建的专家团，等待配置成员与协作步骤。", "本地工作区", [], []); catalogue.unshift(item("team", manifest, "0", "—", "green")); state.selectedId = id; state.modal = null; state.kind = "all"; }
  render();
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-topic-form]")) return;
  event.preventDefault();
  state.githubTopic = event.target.querySelector("[data-search]")?.value ?? state.githubTopic;
  searchGithubTopic();
});

async function copyInstallCommand() {
  const entry = catalogue.find((candidate) => candidate.manifest.metadata.id === state.selectedId);
  if (!entry || state.installStatus !== "ready" || isInstalled(entry.manifest)) return;
  const command = `pnpm expert:install -- --host ${state.installHost} --id ${entry.manifest.metadata.id}`;
  try {
    await navigator.clipboard.writeText(command);
    state.installCopied = true;
    render();
  } catch {
    state.installCopied = false;
    render();
  }
}

document.addEventListener("change", (event) => {
  if (event.target.id !== "install-host") return;
  state.installHost = event.target.value;
  state.installCopied = false;
  render();
});

document.addEventListener("input", (event) => {
  if (!event.target.matches("[data-search]")) return;
  if (state.searchMode === "github-topic") {
    state.githubTopic = event.target.value;
    return;
  }
  state.query = event.target.value;
  render();
  const input = document.querySelector("[data-search]");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
});
render();
loadInstalledSkills();
