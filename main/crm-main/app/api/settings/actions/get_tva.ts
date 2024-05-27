"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const getTva = async (departement_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userRole = user.data.user?.role;
  if (!userRole || !departement_id) {
    return { error: "An error occurred while fetching company profile data" };
  }

  const query = await getTablePermissionForSpecificRows(userRole, "TVA", [
    "name",
    "value",
  ]);

  const { data, error } = await supabase
    .from("TVA")
    .select(query)
    .eq("department_id", departement_id);
  if (error) {
    return { error: "An error occurred while fetching company profile data" };
  } else {
    return { data };
  }
};

export default getTva;
