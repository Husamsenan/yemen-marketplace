import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: { id: "demo-user", verified: true, ...body }, token: "local-demo-token" });
}
