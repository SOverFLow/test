"use server";
import { cookies } from "next/headers";
import { createClient } from "./server";

export async function fetchWorkers(workerId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("UserWorker")
    .select("*")
    .eq("uid", workerId)
    .single();
  if (error) {
    console.log("error", error);
  }
  if (data) {
    console.log("data", data);
    return data;
  }
}