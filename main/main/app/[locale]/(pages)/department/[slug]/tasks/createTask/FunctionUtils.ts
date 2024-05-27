import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getData(department_id: string) {
  let alldata = [];

  const { data: ClientData, error: error } = await supabase
    .from("Department")
    .select("client_department(Client(*))")
    .eq("uid", department_id)
    .single();
  if (ClientData) {
    const clients = ClientData.client_department.map((client) => {
      return {
        uid: client.Client?.uid ?? "",
        email: client.Client?.email ?? "",
        first_name: client.Client?.first_name ?? "",
        last_name: client.Client?.last_name ?? "",
        phone: client.Client?.phone ?? "",
        status: client.Client?.status ?? "",
        created_at: client.Client?.created_at ?? "",
        updated_at: client.Client?.updated_at ?? "",
        id: client.Client?.id ?? 0,
      };
    });
    alldata.push(clients);
  }

  const { data: WorkerData } = await supabase
    .from("Department")
    .select("department_user_worker(UserWorker(*))")
    .eq("uid", department_id)
    .single();
  if (WorkerData) {
    const Workers = WorkerData.department_user_worker.map((worker) => {
      return {
        uid: worker.UserWorker?.uid ?? "",
        email: worker.UserWorker?.email ?? "",
        first_name: worker.UserWorker?.first_name ?? "",
        last_name: worker.UserWorker?.last_name ?? "",
        phone: worker.UserWorker?.phone ?? "",
        profile_picture: worker.UserWorker?.avatar ?? "",
        status: worker.UserWorker?.status ?? "",
        created_at: worker.UserWorker?.created_at ?? "",
        updated_at: worker.UserWorker?.updated_at ?? "",
        task_cost_id: worker.UserWorker?.task_cost_id ?? "",
        salary_hour: worker.UserWorker?.salary_hour ?? 0,
        salary_day: worker.UserWorker?.salary_day ?? 0,
        id: worker.UserWorker?.id ?? 0,
      };
    });
    alldata.push(Workers);
  }

  const { data: StudentData } = await supabase
    .from("Department")
    .select("department_user_student(Student(*))")
    .eq("uid", department_id)
    .single();
  if (StudentData) {
    const students = StudentData.department_user_student.map((Student) => {
      return {
        uid: Student.Student?.uid ?? "",
        email: Student.Student?.email ?? "",
        first_name: Student.Student?.first_name ?? "",
        last_name: Student.Student?.last_name ?? "",
        phone: Student.Student?.phone ?? "",
        profile_picture: Student.Student?.avatar ?? "",
        status: Student.Student?.status ?? "",
        created_at: Student.Student?.created_at ?? "",
        id: Student.Student?.id ?? 0,
        level: Student.Student?.level ?? "",
        notes: Student.Student?.notes ?? "",
        budget: Student.Student?.budget ?? "",
        client_id: Student.Student?.client_id ?? "",
      };
    });
    alldata.push(students);
  }

  const { data: StatusData } = await supabase
    .from("TaskColumn")
    .select("*")
    .eq("department_id", department_id);
  alldata.push(StatusData);

  return alldata;
}

export const getTaskDraft = async (department_id: string, userId: string) => {
  const { data, error } = await supabase
    .from("task_draft")
    .select("*")
    .eq("department_id", department_id)
    .eq("user_id", userId)
  if (error) {
    console.log("error: ", error);
    return;
  }
  const task = data[0];
  const draftWorkers = await getTaskDraftWorker(data[0].uid);
  const draftStudents = await getTaskDraftStudent(data[0].uid);
  const draftClient = await getTaskClient(data[0].client_id);
  return { task, draftWorkers, draftStudents, draftClient };
}

export const DeleteTaskDraft = async (task_id: string) => {

  const { data: data1, error: error1 } = await supabase
    .from("task_user_worker_draft")
    .delete()
    .eq("task_id", task_id)
  if (error1) {
    throw error1;
  }

  const { data: data2, error: error2 } = await supabase
    .from("task_user_students_draft")
    .delete()
    .eq("task_id", task_id)

  const { data, error } = await supabase
    .from("task_draft")
    .delete()
    .eq("uid", task_id)
  if (error) {
    throw error;
  }
  return data;
}

export const getTaskClient = async (client_id: string) => {
  const { data, error } = await supabase
    .from("Client")
    .select("*")
    .eq("uid", client_id)
    .single()
  if (error) {
    throw error;
  }
  return data;
}

export const getTaskDraftWorker = async (task_id: string) => {
  const { data, error } = await supabase
    .from("task_user_worker_draft")
    .select("UserWorker(*), task_id")
    .eq("task_id", task_id)
  if (error) {
    throw error;
  }
  return data;
}

export const getTaskDraftStudent = async (task_id: string) => {
  const { data, error } = await supabase
    .from("task_user_students_draft")
    .select("Student(*), task_id")
    .eq("task_id", task_id)
  if (error) {
    throw error;
  }
  return data;
}

export async function getProductsOutOfStockForTask(department_id: string) {
  const { data, error } = await supabase
    .from("Product")
    .select('buy_price, buy_tva(name, value), stock_id, uid, name, image, country_of_origin, department_id, nature_of_product, sell_price, sell_tva(name, value), quantity, notes')
    .eq("department_id", department_id)
    .is("stock_id", null);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}

export const getBien = async (department_id: string, client_id: string) => {
  const { data, error } = await supabase
    .from("Bien")
    .select("*")
    // .eq("department_id", department_id);
    .eq("client_id", client_id)
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}

export async function getProductsInStockForTask(department_id: string) {
  const { data, error } = await supabase
    .from("Product")
    .select('buy_price, buy_tva(name, value), stock_id, uid, name, image, country_of_origin, department_id, nature_of_product, sell_price, sell_tva(name, value), quantity, notes')
    .eq("department_id", department_id)
    .not("stock_id", "is", null)
    .not("quantity", "eq", 0);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}