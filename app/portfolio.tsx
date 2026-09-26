"use client";
import { useEffect } from "react";
type Content = Record<string, any>;
function applyContent(data: Content) {
  document.title = `${data.name} — ${data.role}`;
  const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const text = (selector: string, value: string) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  text(".hero-badge span:last-child", data.available);
  const hero = document.getElementById("hero-name");
  if (hero) {
    hero.replaceChildren(
      ...data.name.split("").map((ch: string, i: number) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00a0" : ch;
        span.style.animationDelay = `${i * 0.05}s`;
        return span;
      }),
    );
  }
  text(".hero-desc", data.heroDescription);
  text(".about-text p", data.aboutDescription);
  const type = document.getElementById("typewriter");
  if (type) type.textContent = data.role;
  text(".email-text", data.email);
  const email = document.querySelector<HTMLAnchorElement>(
    ".hero-ctas .btn-outline",
  );
  if (email) email.href = `mailto:${data.email}`;
  const emailCopy = document.getElementById("email-copy");
  if (emailCopy) emailCopy.setAttribute("data-email", data.email);
  const github = document.querySelector<HTMLAnchorElement>(".social-link");
  if (github) github.href = data.github;
  const emailLink = document.querySelector<HTMLAnchorElement>('.social-link[href^="mailto:"]');
  if (emailLink) emailLink.href = `mailto:${data.email}`;
  const groups = new Map<string, typeof data.skills>();
  for (const skill of data.skills) {
    if (!groups.has(skill.group)) groups.set(skill.group, []);
    groups.get(skill.group)!.push(skill);
  }
  const grid = document.querySelector(".skills-grid");
  if (grid)
    grid.innerHTML = [...groups]
      .map(
        ([group, skills]) =>
          `<div class="skill-group reveal"><h3>${esc(group)}</h3>${skills.map((s: any) => `<div class="skill-item"><div class="skill-top"><span class="skill-name">${esc(s.name)}</span><span class="skill-pct">${Number(s.level)}%</span></div><div class="skill-bar-bg"><div class="skill-bar-fill" data-width="${Number(s.level)}" style="width:${Number(s.level)}%"></div></div></div>`).join("")}</div>`,
      )
      .join("");
  const projects = document.querySelector(".projects-grid");
  if (projects)
    projects.innerHTML = data.projects
      .map(
        (p: any, i: number) =>
          `<div class="project-card reveal ${i ? `reveal-delay-${Math.min(i, 3)}` : ""}" data-tilt><div class="card-banner ${i === 1 ? "b2" : i === 2 ? "b3" : ""} ${p.banner ? "has-banner" : ""}">${p.banner ? `<img class="card-banner-image" src="${esc(p.banner)}" alt="${esc(p.title)} banner" loading="lazy">` : ""}</div><div class="card-body"><div class="card-num">${String(i + 1).padStart(2, "0")} / PROJECT</div><div class="card-title">${esc(p.title)}</div><p class="card-desc">${esc(p.description)}</p><div class="card-tags">${p.tags.map((tag: string) => `<span class="tag">${esc(tag)}</span>`).join("")}</div><a href="${esc(p.url || "#")}" class="card-link" target="_blank" rel="noopener noreferrer">${esc(p.linkLabel)} →</a></div></div>`,
      )
      .join("");
  const process = document.querySelector(".process-steps");
  if (process) process.innerHTML = `<div class="process-line"></div>${data.process.map((p:any,i:number)=>`<div class="step reveal ${i?`reveal-delay-${Math.min(i,3)}`:""}"><div class="step-num">${String(i+1).padStart(2,"0")}</div><div class="step-dot"></div><div class="step-title">${esc(p.title)}</div><p class="step-desc">${esc(p.description)}</p></div>`).join("")}`;
  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) statsGrid.innerHTML = data.stats.map((s:any)=>`<div class="stat-item reveal"><span class="stat-num" ${/^\d+$/.test(s.value)?`data-target="${s.value}"`:""}>${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></div>`).join("");
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    const words = [...data.marquee, ...data.marquee];
    marquee.innerHTML = words
      .map((w: string) => `<div class="marquee-item">${esc(w)} <span>•</span></div>`)
      .join("");
  }
}
export default function Portfolio({ initialHtml }: { initialHtml: string }) {
  useEffect(() => {
    let live = true;
    const dataPromise = fetch("/api/content").then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not load portfolio content.");
      return data;
    }).catch((error) => { console.error("Portfolio content did not load:", error); return null; });
    const w = window as any;
    if (!w.__portfolioScriptPromise) {
      w.__portfolioScriptPromise = new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "/portfolio.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Could not load portfolio effects."));
        document.body.appendChild(s);
      });
    }
    const scriptPromise: Promise<void> = w.__portfolioScriptPromise;
    scriptPromise.then(() => {
      if (live && typeof w.initPreloader === "function") w.initPreloader();
    }).catch((error) => console.error(error));
    Promise.all([dataPromise, scriptPromise]).then(([data]) => {
      if (!live) return;
      if (data) applyContent(data);
      if (typeof w.initPortfolio === "function") w.initPortfolio();
    }).catch((error) => console.error(error));
    return () => {
      live = false;
    };
  }, []);
  return (
    <div className="portfolio-root" dangerouslySetInnerHTML={{ __html: initialHtml }} />
  );
}
