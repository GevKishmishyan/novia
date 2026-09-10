import { NextResponse } from "next/server";

export function apiError(message: string, status: number, fields?: Record<string, string[] | undefined>) {
  return NextResponse.json({ error: { fields, message } }, { status });
}
