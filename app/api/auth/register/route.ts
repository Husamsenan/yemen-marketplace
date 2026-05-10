import { NextResponse } from "next/server";
import { getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          display_name: body.name ?? body.displayName,
          phone: body.phone
        }
      }
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      {
        data: {
          id: data.user?.id,
          email: data.user?.email,
          needsVerification: !data.session
        }
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    {
      data: {
        id: `pending-user-${Date.now()}`,
        email: body.email,
        needsVerification: true,
        demoCode: "123456"
      }
    },
    { status: 201 }
  );
}
