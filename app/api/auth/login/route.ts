import { NextResponse } from "next/server";
import { getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({
      data: {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone
      },
      token: data.session?.access_token
    });
  }

  return NextResponse.json({ data: { id: "demo-user", verified: true, ...body }, token: "local-demo-token" });
}
