import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { isLoggedIn } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await params;
  const order = await store().get(id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ order });
}
