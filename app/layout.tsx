import type { Metadata } from "next";
import "./site.css";
import "./admin.css";
export const metadata: Metadata = { title: "Md Mojahid — Full-Stack Developer & AI Builder", description: "CSE student, Full-Stack Developer, AI Builder from India" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/><link rel="stylesheet" href="/portfolio.css"/></head><body>{children}</body></html>;
}
