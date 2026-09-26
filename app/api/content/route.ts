import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getContent(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load portfolio content." }, { status: 503 }); }
}
export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in to save portfolio changes." }, { status: 401 });
  try { await saveContent(await request.json()); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save content." }, { status: 400 }); }
}
