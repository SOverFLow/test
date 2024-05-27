"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";


export async function getDepartmentData(departmentId: number | string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  let { data: Departments, error } = await supabase
    .from("Department")
    .select("uid, title")
    .eq("super_admin_id", user.data.user?.id);

  if (Departments && Departments.length > 0) {
    return {
      success: Departments,
    };
  }
  return null;
}
