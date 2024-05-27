"use server";
import { Comment } from "@/app/[locale]/(pages)/department/[slug]/tasks/[taskId]/Comments/utils/types";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { send } from "process";

const addComment = async (commentData: Comment) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { task_id, content, sender_id, sender_img, sender_name } = commentData;

  const res = await supabase.from("Comment").insert([
    {
      task_id,
      sender_id,
      sender_img,
      sender_name,
      content,
    },
  ]);

  if (res.error) {
    console.error(res.error);
    return { error: res.error.message };
  } else {
    return { success: "your Comment has been added!" };
  }
};

export default addComment;
