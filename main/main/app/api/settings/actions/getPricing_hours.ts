"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export const getPricing_hours = async (departmentId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("DepartmentSettings")
      .select("pricing_hours")
      .eq("department_id", departmentId);
    if (error) {
      return { error: "An error occurred while fetching company profile data" };
    } else {
      return { success: data[0] };
    }
  }
};