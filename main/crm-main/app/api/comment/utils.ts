// import { createClient } from "@/utils/supabase/client";

// const supabase = createClient();

// export async function getComments(taskId: string) {
//   const { data, error } = await supabase.from("Comment").select("*").eq('task_id', taskId);
//   return { data, error };
// }

// export async function addComment(body: any) {
//   const { data, error } = await supabase.from("Comment").insert([body]);
//   return { data, error };
// }

// export async function deleteComment(commentId: string) {
//   const { data, error } = await supabase
//     .from("Comment")
//     .delete()
//     .match({ id: commentId });
//   return { data, error };
// }

// export async function updateComment(updatedComment: any, commentId: string) {
//   const { data, error } = await supabase
//     .from("Comment")
//     .update(updatedComment)
//     .match({ id: commentId });
//   return { data, error };
// }
