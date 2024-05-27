import { getDbOnSever } from "@/utils/supabase/cookie";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

export async function fetchTva(department_id: string) {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "TVA", [
    "uid",
    "country",
    "description",
    "name",
    "department_id",
    "value",
  ]);
  const { data, error } = await supabase
    .from("TVA")
    .select(query)
    .eq("department_id", department_id);
  if (error) {
    console.log("error: ", error);
    return [];
  }

  return data;
}
