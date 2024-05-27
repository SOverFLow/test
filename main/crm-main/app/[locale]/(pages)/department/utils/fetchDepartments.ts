import { getDbOnSever } from "@/utils/supabase/cookie";
import type DepartmentType from "./department.types";
import { createClient } from "@/utils/supabase/client";

export default async function fetchDepartmentsServer(): Promise<
  DepartmentType[] | null
> {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Department")
    .select("uid, created_at, title, description");
  if (error) {
    console.log("error: ", error);
    return [];
  }

  return data;
}

export async function fetchDepartmentsClient(): Promise<DepartmentType[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Department")
    .select("uid, created_at, title, description");
  if (error) {
    console.log("error: ", error);
    return [];
  }

  return data;
}
