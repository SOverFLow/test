"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export async function getDepartementClients(department_id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: ClientData, error: error } = await supabase
    .from("Department")
    .select("client_department(Client(*))")
    .eq("uid", department_id)
    .single();
  if (ClientData) {
    const clients = ClientData.client_department.map((client: any) => {
      return {
        uid: client.Client?.uid ?? "",
        name: client.Client?.first_name + " " + client.Client?.last_name,
      };
    });
    return {
      data: clients,
    };
  } else {
    return {
      error: error.message,
    };
  }
}
