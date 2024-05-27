import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const allLanguages = ["en", "fr"];

export async function middleware(request: NextRequest) {
  const defaultLocale = request.cookies?.get("NEXT_LOCALE")?.value || "en";
  if (request.nextUrl.pathname.startsWith("/test")) {
    return NextResponse.next();
  }
  const handleI18nRouting = createIntlMiddleware({
    locales: allLanguages,
    defaultLocale,
  });

  let response = handleI18nRouting(request);
  const [, urlLang, ...segments] = request.nextUrl.pathname.split("/");

  if (urlLang == "api" || urlLang == `/_next/`) {
    console.log("api call");
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (!segments.length && urlLang) {
    console.log("1: ", segments.length, urlLang);
    const { data, error } = await supabase
      .from("Department")
      .select("uid")
    if (error) {
      console.log("error fetching depart middleware:", error);
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    if (data && data[0]?.uid) {
      url.pathname = `/${urlLang}/department/${data[0]?.uid}/dashboard`;
      return NextResponse.redirect(url);
    }
    else {
      url.pathname = `/${urlLang}/department/`;
      return NextResponse.redirect(url);
    }
  }

  let lang = allLanguages.includes(urlLang) ? urlLang : defaultLocale;

  const currentPath = `/${lang}/${segments.join("/")}`;
  // console.log("currentPath", currentPath);

  if (currentPath.startsWith(`/${lang}/reset`)) {
    // console.log("reset");
    return response;
  }

  try {
    const { data: user } = await supabase.auth.getUser();
    const redirectPathname = request.nextUrl.pathname;
    // Redirect unauthenticated users to the login page
    if (!user?.user) {
      console.log("2: ", lang, request.url);
      if (
        !currentPath.endsWith(`/${lang}/login`) &&
        !currentPath.endsWith(`/${lang}/signup`)
      ) {
        if (currentPath.startsWith(`/${lang}/department`)){
          return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
        }
        else {
          return NextResponse.redirect(new URL(`/${lang}/login?redirect=${redirectPathname}`, request.url));
        }
      }
    } else {
      // Redirect authenticated users away from login and signup
      if (
        currentPath.endsWith(`/${lang}/login`) ||
        currentPath.endsWith(`/${lang}/signup`)
      ) {
        const { data } = await supabase
          .from("Department")
          .select("uid")
          .single();
        console.log("new data:  ", data);
        if (data?.uid) {
          return NextResponse.redirect(
            new URL(`/${lang}/department/${data?.uid}/dashboard`, request.url)
          );
        }
        return NextResponse.redirect(
          new URL(`/${lang}/department/`, request.url)
        );
      }
    }
    if (
      currentPath != `/${lang}/department` &&
      currentPath.startsWith(`/${lang}/department`)
    ) {
      const uid = currentPath.split("/")[3];
      if (uid) {
        const { data: department, error } = await supabase
          .from("Department")
          .select("*")
          .eq("uid", uid)
          .single();
        if (!department || error) {
          // console.log("department not found");
          const redirectURL = new URL(`/${lang}/department`, request.url);
          redirectURL.searchParams.append("departmentNotFound", "true");
          return NextResponse.redirect(redirectURL);
        } else if (currentPath.split("/").length == 4) {
          return NextResponse.redirect(
            new URL(`/${lang}/department/${uid}/dashboard`, request.url)
          );
        }
      }
    }

    // console.log("here babe");
    return response;
  } catch (e) {
    console.error("Error in middleware:", e);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(fr|en)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
