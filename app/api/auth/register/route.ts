import { NextResponse } from "next/server";
import { getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      phone: body.phone,
      options: {
        data: {
          display_name: body.name ?? body.displayName
        }
      }
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: { id: data.user?.id, email: data.user?.email, phone: data.user?.phone } }, { status: 201 });
  }

  return NextResponse.json({ data: { id: `user-${Date.now()}`, verified: false, ...body } }, { status: 201 });
}
