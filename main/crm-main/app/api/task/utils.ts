import { getDbOnSever } from "@/utils/supabase/cookie";
import { cache } from "react";


export const dynamic = "force-dynamic";

export async function addTask(body: any) {
  const getTask = cache(async () => {
    const supabase = await getDbOnSever();
    console.log("body 1125 ", body);
    const { data, error } = await supabase
      .from("Task")
      .insert([body])
      .select("uid");
    // console.log("error 1125 ", error);
    // console.log("data 112885 ", data);
    return { data, error };
  });
  return await getTask();
}

export async function addTask_draft(body: any) {
  const getTask = cache(async () => {
    const supabase = await getDbOnSever();
    console.log("body 1125 ", body);
    const { data, error } = await supabase
      .from("task_draft")
      .insert([body])
      .select("uid");
    // console.log("error 1125 ", error);
    // console.log("data 112885 ", data);
    return { data, error };
  });
  return await getTask();
}

export async function addTaskDraftUserWorker_relation(body: any) {
  const addTaskUserWorker = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("task_user_worker_draft")
      .insert([body]);
    return { data, error };
  });
  return await addTaskUserWorker();
}

export async function addTaskDraftUserStudent_relation(body: any) {
  const addTaskUserstudent = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("task_user_students_draft")
      .insert([body]);
    return { data, error };
  });
  return await addTaskUserstudent();
}

export async function addTaskUserWorker_relation(body: any) {
  const addTaskUserWorker = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("task_user_worker")
      .insert([body]);
    return { data, error };
  });
  return await addTaskUserWorker();
}

export async function addTaskUserStudent_relation(body: any) {
  const addTaskUserstudent = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("task_user_students")
      .insert([body]);
    return { data, error };
  });
  return await addTaskUserstudent();
}

export async function editTask(body: any, taskId: number | string) {
  const editTask = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("Task")
      .update(body)
      .eq("uid", taskId)
      .select("uid");
    return { data, error };
  });
  return await editTask();
}


export async function editTaskUserWorker_relation(body: any, taskId: number | string) {
  const editTaskUserWorker = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("task_user_worker")
      .update(body)
      .eq("task_id", taskId);
    return { data, error };
  });
  return await editTaskUserWorker();
}


export async function EditProductTask(
  task_id: string,
  product_ids: any[],
  productsOutStock: any[]
) {
  const supabase = await getDbOnSever();

  for (let index = 0; index < productsOutStock.length; index++) {
    const product_id = productsOutStock[index].uid;
    const { data, error: dataError } = await supabase
      .from("Product")
      .update({ task_id })
      .eq("uid", product_id);

    if (dataError) {
      throw dataError;
    }
  }

  for (let index = 0; index < product_ids.length; index++) {
    const product_id = product_ids[index];
    const { data: productData, error: productError } = await supabase
      .from("Product")
      .select("quantity")
      .eq("uid", product_id);

    if (productError) {
      throw productError;
    }

    const oldQuantity = productData[0]?.quantity;
    if (oldQuantity != 0) {
      const newQuantity = oldQuantity !== null ? oldQuantity - 1 : null;

      const { data, error: dataError } = await supabase
        .from("Product")
        .update({ task_id, quantity: newQuantity })
        .eq("uid", product_id);

      if (dataError) {
        throw dataError;
      }
    }

  }

  return "Products updated successfully";
}
