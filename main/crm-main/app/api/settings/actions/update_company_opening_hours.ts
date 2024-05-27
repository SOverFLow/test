"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

type FormData = {
  [x: string]: any;
  monday_start_hour?: string;
  monday_end_hour?: string;
  tuesday_start_hour?: string;
  tuesday_end_hour?: string;
  wednesday_start_hour?: string;
  wednesday_end_hour?: string;
  thursday_start_hour?: string;
  thursday_end_hour?: string;
  friday_start_hour?: string;
  friday_end_hour?: string;
  saturday_start_hour?: string;
  saturday_end_hour?: string;
  sunday_start_hour?: string;
  sunday_end_hour?: string;
};
// this is the server-side action for updating the public profile
const updateCompanyOpenningHours = async (formData: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  const {
    monday_end_hour,
    monday_start_hour,
    tuesday_end_hour,
    tuesday_start_hour,
    wednesday_end_hour,
    wednesday_start_hour,
    thursday_end_hour,
    thursday_start_hour,
    friday_end_hour,
    friday_start_hour,
    saturday_end_hour,
    saturday_start_hour,
    sunday_end_hour,
    sunday_start_hour,
  } = formData;
  // update the profile
  const updateResponse = await supabase
    .from("Company")
    .update({
      monday_end_hour,
      monday_start_hour,
      tuesday_end_hour,
      tuesday_start_hour,
      wednesday_end_hour,
      wednesday_start_hour,
      thursday_end_hour,
      thursday_start_hour,
      friday_end_hour,
      friday_start_hour,
      saturday_end_hour,
      saturday_start_hour,
      sunday_end_hour,
      sunday_start_hour,
    })
    .eq("super_admin_id", user.data.user?.id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    return { success: "Company profile has been updated!" };
  }
};

export default updateCompanyOpenningHours;
