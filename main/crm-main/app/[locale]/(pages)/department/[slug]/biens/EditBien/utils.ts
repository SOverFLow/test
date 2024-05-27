import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getBienData(bien_id: number | string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Bien", [
    "name",
    "price",
    "description",
    "type",
    "location",
    "zip_code",
    "city",
    "country",
    "phone",
    "state_province",
    "status",
    "client_id",
  ]);

  const { data, error } = await supabase
    .from("Bien")
    .select(query)
    .eq("uid", bien_id)
    .single();
  if (error) {
    console.error("Error fetching data", error);
    return;
  }
  return data;
}
