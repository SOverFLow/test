"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const modifyProfileData = async (data: {
  uid: string;
  role: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_name: string;
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: profile, error } = await supabase
    .from("SuperAdmin")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      username: data.user_name,
    })
    .eq("uid", data.uid);
  return error;
};

export default modifyProfileData;
