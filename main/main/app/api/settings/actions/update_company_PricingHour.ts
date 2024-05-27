"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

type InputHourPrice = {
  startTime: string;
  endTime: string;
  priceMultiplication: string;
};

type FormData = {
  timeRanges: InputHourPrice[];
  saturdayPriceMultiplication: string;
  sundayPriceMultiplication: string;
  daysOff: {
    dates: string[];
    priceMultiplication: string;
  };
};

const updateCompanyPricingHours = async (
  formData: FormData,
  departement_id: string
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (departement_id === "") {
    return { error: "No department id provided" };
  }
  const updateResponse = await supabase
    .from("DepartmentSettings")
    .update({
      pricing_hours: formData,
    })
    .eq("department_id", departement_id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    return { success: "Company profile has been updated!" };
  }
};

export default updateCompanyPricingHours;
