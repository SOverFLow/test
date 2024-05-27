import { getDbOnSever } from "@/utils/supabase/cookie";
import { Column } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerColumns(
  department_id: string,
): Promise<Column[] | null> {
  const supabase = await getDbOnSever();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.role) {
    console.log("user role not found");
    return null;
  }
  const query = await getTablePermissionForSpecificRows(userData.user?.role, "TaskColumn", [
    "uid",
    "title",
  ]);
  const { data, error } = await supabase
    .from("TaskColumn")
    .select(query)
    .eq("department_id", department_id);
  if (error) {
    console.log("error: ", error);
    return null;
  }
  return data as any;
}

async function createNewColumn(
  department_id: string,
  title: string
): Promise<Column | null> {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("TaskColumn")
    .insert([{ department_id, title }])
    .single();
  if (error) {
    console.log("error: ", error);
    return null;
  }
  return data;
}

export { createNewColumn };
export default fetchServerColumns;
