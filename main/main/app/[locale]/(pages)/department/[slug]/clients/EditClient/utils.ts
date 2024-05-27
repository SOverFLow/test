import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getClientData(client_id: number | string) {
  

  const { data: ClientData, error: error } = await supabase
    .from("Client")
    .select("*")
    .eq("uid", client_id)
    .single();
  if (ClientData) {
    
      return {
        email: ClientData.email ?? "",
        first_name: ClientData.first_name ?? "",
        last_name: ClientData.last_name ?? "",
        phone: ClientData.phone ?? "",
      };
    }
  }