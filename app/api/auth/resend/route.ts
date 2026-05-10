import { NextResponse } from "next/server";
import { getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: { email, sent: true, demoCode: hasSupabaseConfig() ? undefined : "123456" } });
}
