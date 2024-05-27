"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const fetchBanks = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userRole = user.data.user?.role;
  if (!userRole) {
    return { error: "An error occurred while fetching banks data" };
  }
  const query = await getTablePermissionForSpecificRows(userRole, "Bank", [
    "label",
    "bank_name",
    "currency",
    "country",
    "account_number",
    "iban_number",
    "bic_swift_code",
    "bank_address",
    "account_owner_name",
    "account_owner_address",
    "is_active",
    "uid",
    "created_at",
    "updated_at",
    "id",
  ]);

  // update the profile
  const response = await supabase
    .from("Bank")
    .select(query)
    .eq("user_id", user.data.user?.id);

  if (response.error) {
    console.error(response.error);
    return { error: response.error.message };
  } else {
    return { data: response.data };
  }
};

export default fetchBanks;
