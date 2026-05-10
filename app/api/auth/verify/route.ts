import { NextResponse } from "next/server";
import { getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const token = String(body.code ?? body.token ?? "").trim();

  if (!email || !token) {
    return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
  }

  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup"
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      data: {
        id: data.user?.id,
        email: data.user?.email,
        verified: Boolean(data.user?.email_confirmed_at)
      },
      token: data.session?.access_token
    });
  }

  if (token !== "123456") {
    return NextResponse.json({ error: "Invalid verification code. Demo code is 123456." }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      id: "demo-user",
      email,
      verified: true
    },
    token: "local-demo-token"
  });
}
