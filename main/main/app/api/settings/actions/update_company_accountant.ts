"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

// type FormData = {
//   [x: string]: any;

// };
type FormData = {
  [x: string]: any;
  Name?: string;
  Zip?: string;
  Town?: string;
  Country?: string;
  Phone?: string;
  Address?: string;

  EMail?: string;
  Web?: string;
  ["Accountant code"]?: string;
  Note?: string;
};
// this is the server-side action for updating the public profile
const updateCompanyAccountant = async (formData: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  const { Name, Zip, Town, Address, Country, Phone, EMail, Web, Note } =
    formData;
  // update the profile
  const updateResponse = await supabase
    .from("Company")
    .update({
      accountant_name: Name,
      accountant_zip: Zip,
      accountant_town: Town,
      accountant_country: Country,
      accountant_phone: Phone,
      accountant_email: EMail,
      accountant_web: Web,
      accountant_code: formData["Accountant code"],
      accountant_note: Note,
      accountant_address: Address,
    })
    .eq("super_admin_id", user.data.user?.id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    return { success: "Company profile has been updated!" };
  }
};

export default updateCompanyAccountant;
