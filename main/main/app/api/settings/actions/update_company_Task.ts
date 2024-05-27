"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

type FormData = {
  [x: string]: any;
  currency?: string;
  ["working hours"]?: number;
  ["minimal minutes per task"]?: number;
};

const updateCompanyTask = async (
  formData: FormData,
  departement_id: string
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (departement_id === "") {
    return { error: "No department id provided" };
  }
  console.log("formData", formData);
  console.log("departement_id", departement_id);
  const updateResponse = await supabase
    .from("DepartmentSettings")
    .update({
      currency: formData.currency,
      working_hours: formData["working hours"],
      minimal_minutes_per_task: formData["minimal minutes per task"],
      tva: formData.tva,
    })
    .eq("department_id", departement_id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    console.log("updateResponse", updateResponse);
    return { success: "Company profile has been updated!" };
  }
};

export default updateCompanyTask;
