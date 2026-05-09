import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: { id: `user-${Date.now()}`, verified: false, ...body } }, { status: 201 });
}
