"use server";
import { cookies } from "next/headers";
import { createClient } from "./server";

export async function fetchClients(clientId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Client")
    .select("*")
    .eq("uid", clientId)
    .single();
  if (error) {
    console.log("error", error);
  }
  if (data) {
    console.log("data", data);
    return data;
  }
}