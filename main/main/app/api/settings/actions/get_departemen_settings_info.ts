"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const getDepartementSettingsInfo = async (departement_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userRole = user.data.user?.role;
  if (!userRole || !departement_id) {
    return { error: "An error occurred while fetching company profile data" };
  }

  const query = await getTablePermissionForSpecificRows(
    userRole,
    "DepartmentSettings",
    [
      "tva",
      "pricing_hours",
      "currency",
      "working_hours",
      "minimal_minutes_per_task",
      "department_id",
      "created_at",
      "id",
    ]
  );

  const { data, error } = await supabase
    .from("DepartmentSettings")
    .select(query)
    .eq("department_id", departement_id);
  if (error) {
    return { error: "An error occurred while fetching company profile data" };
  } else {
    console.log("data", data);
    return { success: data[0] };
  }
};

export default getDepartementSettingsInfo;
