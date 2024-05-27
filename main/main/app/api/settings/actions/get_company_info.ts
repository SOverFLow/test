"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const getCompanyInfo = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userRole = user.data.user?.role;
  if (!userRole) {
    return { error: "An error occurred while fetching company profile data" };
  }
  const query = await getTablePermissionForSpecificRows(userRole, "Company", [
    "name",
    "email",
    "address",
    "logo",
    "phone",
    "website",
    "note",
    "monday_start_hour",
    "monday_end_hour",
    "tuesday_start_hour",
    "tuesday_end_hour",
    "wednesday_start_hour",
    "wednesday_end_hour",
    "thursday_start_hour",
    "thursday_end_hour",
    "friday_start_hour",
    "friday_end_hour",
    "saturday_start_hour",
    "saturday_end_hour",
    "sunday_start_hour",
    "sunday_end_hour",
    "accountant_name",
    "accountant_address",
    "accountant_zip",
    "accountant_town",
    "accountant_country",
    "accountant_phone",
    "accountant_email",
    "accountant_web",
    "accountant_code",
    "accountant_note",
    "currency",
    "working_hours",
    "minimal_minutes_per_task",
    "super_admin_id",
    "country",
    "city",
    "zip_code",
    "pricing_hours",
    "tva",
    "siret",
    "capital",
    "conditions_bank",
    "uid",
    "created_at",
    "updated_at",
    "id",
  ]);
  if (user) {
    const { data, error } = await supabase
      .from("Company")
      .select(query)
      .eq("super_admin_id", user.data.user?.id);
    if (error) {
      return { error: "An error occurred while fetching company profile data" };
    } else {
      return { success: data[0] };
    }
  }
};

export default getCompanyInfo;
