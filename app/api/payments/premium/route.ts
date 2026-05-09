import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    data: {
      id: `payment-${Date.now()}`,
      status: "paid",
      plan: body.plan ?? "premium-7-days",
      amount: body.amount ?? 5
    }
  });
}
