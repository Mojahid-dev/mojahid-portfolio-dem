import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

export type PortfolioContent = {
  name: string;
  role: string;
  available: string;
  heroDescription: string;
  aboutDescription: string;
  email: string;
  github: string;
  skills: { group: string; name: string; level: number }[];
  projects: {
    title: string;
    description: string;
    banner: string;
    tags: string[];
    url: string;
    linkLabel: string;
  }[];
  process: { title: string; description: string }[];
  marquee: string[];
  stats: { value: string; label: string }[];
};
const contentPath = path.join(process.cwd(), "data", "content.json");
let sql: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (!sql)
    sql = postgres(url, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  if (!schemaReady)
    schemaReady =
      sql`CREATE TABLE IF NOT EXISTS portfolio_content (id smallint PRIMARY KEY CHECK (id = 1), content jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`.then(
        () => undefined,
      );
  return sql;
}
async function starterContent(): Promise<PortfolioContent> {
  return JSON.parse(await readFile(contentPath, "utf8")) as PortfolioContent;
}
export async function getContent(): Promise<PortfolioContent> {
  const db = database();
  if (!db) {
    if (process.env.VERCEL)
      throw new Error(
        "Set DATABASE_URL to a persistent Postgres database before using the portfolio on Vercel.",
      );
    return starterContent();
  }
  await schemaReady;
  const rows = await db`SELECT content FROM portfolio_content WHERE id = 1`;
  if (rows[0]) return rows[0].content as PortfolioContent;
  const initial = await starterContent();
  await db`INSERT INTO portfolio_content (id, content) VALUES (1, ${db.json(initial)}) ON CONFLICT (id) DO NOTHING`;
  const seeded = await db`SELECT content FROM portfolio_content WHERE id = 1`;
  return seeded[0].content as PortfolioContent;
}
export async function saveContent(value: unknown) {
  const parsed = value as Partial<PortfolioContent>;
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof parsed.name !== "string" ||
    !Array.isArray(parsed.projects) ||
    !Array.isArray(parsed.skills)
  )
    throw new Error("Content needs a name, projects list, and skills list.");
  parsed.projects = parsed.projects.map((project) => ({ ...project, banner: project.banner || "" }));
  const validWebUrl = (value: string, optional = false) => {
    if (optional && !value) return true;
    try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
  };
  if (typeof parsed.github !== "string" || !validWebUrl(parsed.github)) throw new Error("Enter a valid http or https profile URL.");
  if (parsed.projects.some((project) => !project || typeof project.title !== "string" || typeof project.description !== "string" || !Array.isArray(project.tags) || typeof project.banner !== "string" || !validWebUrl(project.url, true) || (project.banner && !validWebUrl(project.banner)))) throw new Error("Check each project title, description, tech stack, banner, and link.");
  if (parsed.skills.some((skill) => !skill || typeof skill.group !== "string" || typeof skill.name !== "string" || !Number.isInteger(skill.level) || skill.level < 0 || skill.level > 100)) throw new Error("Skill progress must be a whole number from 0 to 100.");
  const db = database();
  if (db) {
    await schemaReady;
    await db`INSERT INTO portfolio_content (id, content, updated_at) VALUES (1, ${db.json(parsed)}, now()) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`;
    return;
  }
  if (process.env.VERCEL)
    throw new Error(
      "Set DATABASE_URL to a persistent Postgres database before publishing changes on Vercel.",
    );
  const file = `${contentPath}.tmp`;
  await writeFile(file, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  await rename(file, contentPath);
}
