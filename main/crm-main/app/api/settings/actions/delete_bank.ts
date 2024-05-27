"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const deleteBank = async (bank_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("Bank")
    .delete()
    .eq("uid", bank_id);

  // if (dataError) {
  //   throw dataError;
  // }
  // return "user deleted successfully";

  if (error) {
    console.error(error);
    return { error: error.message };
  } else {
    return { success: "user deleted successfully" };
  }
};

export default deleteBank;
