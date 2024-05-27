"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const updateBankStatus = async (
  new_bank_id: string,
  old_bank_id: string | undefined
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  try {
    if (old_bank_id !== undefined && old_bank_id !== "") {
      await supabase
        .from("Bank")
        .update({
          is_active: false,
        })
        .eq("uid", old_bank_id)
        .eq("user_id", user.data.user?.id);
    }
    if (new_bank_id !== old_bank_id) {
      await supabase
        .from("Bank")
        .update({
          is_active: true,
        })
        .eq("uid", new_bank_id)
        .eq("user_id", user.data.user?.id);
    }

    const { data, error } = await supabase
      .from("Bank")
      .select("*")
      .eq("user_id", user.data.user?.id);
    if (error) {
      console.error(error);
      return { error: "error switching Bank" };
    }
    return { data };
  } catch (error) {
    console.error(error);
    return { error: "error switching Bank" };
  }
};

export default updateBankStatus;
