import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { createClient } from "./server";
import { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export const getDbOnSever = cache(async () => {
  const cookieStore = cookies();
  return createClient(cookieStore);
});

export const getDbOnAction = cache(async () => {
  const cookieStore = cookies();
  return createClient(cookieStore);
});

export const getDbOnRoute = cache(async () => {
  const cookieStore = cookies();
  return createClient(cookieStore);
});
