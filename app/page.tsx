import { readFile } from "node:fs/promises";
import path from "node:path";
import Portfolio from "./portfolio";
export const dynamic = "force-dynamic";
export default async function Home() {
  const html = await readFile(
    path.join(process.cwd(), "public", "portfolio.html"),
    "utf8",
  );
  return <Portfolio initialHtml={html} />;
}
