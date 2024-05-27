"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export const getCurrency = async (department_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("DepartmentSettings")
      .select("currency")
      .eq("department_id", department_id);
    if (error) {
      console.error("Error fetching currency", error);
      return { error: "An error occurred while fetching company profile data" };
    } else {
      return { success: data[0] };
    }
  }
};