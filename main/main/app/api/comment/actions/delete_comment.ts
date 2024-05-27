"use server";
import { Comment } from "@/app/[locale]/(pages)/department/[slug]/tasks/[taskId]/Comments/utils/types";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

const deleteComment = async (commentData: Comment) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase
    .from("Comment")
    .delete()
    .eq("uid", commentData.uid);

  if (res.error) {
    console.error(res.error);
    return { error: res.error.message };
  } else {
    return { success: "your Comment has been deleted!" };
  }
};

export default deleteComment;
