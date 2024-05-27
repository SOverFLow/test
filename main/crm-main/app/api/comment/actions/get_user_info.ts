"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const getUserInfo = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;

  let { data: table, error: tableError } = await supabase.rpc(
    "get_user_table",
    {
      user_uid: userId,
    }
  );

  const { data, error } = await supabase
    .from(table as "SuperAdmin" | "UserWorker" | "Client")
    .select("uid, first_name, last_name, avatar")
    .eq("uid", userId)
    .single();

  if (error) {
    console.error(error);
    return { error: error.message };
  } else {
    return {
      data: {
        id: data.uid,
        name: data.first_name + " " + data.last_name,
        avatar: data.avatar,
      },
    };
  }
};

export default getUserInfo;
