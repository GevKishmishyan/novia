import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, hasSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseConfig()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const { publishableKey, url } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isInvitationEditor = /^\/invitations\/[^/]+\/customize\/?$/.test(request.nextUrl.pathname);
  const isAdminAuthPage = request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/forgot-password";
  const isAdminArea = request.nextUrl.pathname.startsWith("/admin") && !isAdminAuthPage;
  const isCustomerArea = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/account") || isInvitationEditor;
  const isProtected = isCustomerArea || isAdminArea;
  if (isProtected && !data?.claims) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminArea ? "/admin/login" : "/login";
    url.search = "";
    url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }
  if (data?.claims && isCustomerArea) {
    const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
    if (membership) return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
