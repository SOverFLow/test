import { getDbOnSever } from "@/utils/supabase/cookie";
import { NextRequest, NextResponse } from "next/server";
import {
  addTask,
  addTaskUserStudent_relation,
  addTaskUserWorker_relation,
  editTask,
} from "./utils";
import { createNewDevis } from "@/app/[locale]/(pages)/department/[slug]/devis/[DevisID]/utils/createNewInvoice";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const workers = body.workers;
  // console.log("body", body)
  const {
    additional_cost,
    students,
    user_id,
    created_at,
    updated_at,
    uid,
    id,
    dates,
    ...bodyWithoutWorkerId
  } = body;

  const { data: postData, error: postError } =
    await addTask(bodyWithoutWorkerId);

  console.log("err", postError);
  if (postData) {
    // Add the task-user worker relations to the database if there are workers
    if (workers) {
      const taskUserWorkerBodies = [];
      for (const worker of workers!) {
        const bodyForTaskUserWorker = {
          user_worker_id: worker.uid,
          task_id: postData[0].uid,
        };
        taskUserWorkerBodies.push(bodyForTaskUserWorker);
      }
      for (const bodyForTaskUserWorker of taskUserWorkerBodies) {
        const { data: TaskUserWorker, error: TaskUserWorkerError } =
          await addTaskUserWorker_relation(bodyForTaskUserWorker);
        if (TaskUserWorkerError) {
          return NextResponse.json(
            { message: "Error adding task-user worker relation" },
            { status: 500 }
          );
        }
      }
    }

    if (students) {
      console.log("students", students);
      const taskUserstudentsBodies = [];
      for (const student of students!) {
        const bodyForTaskUserstudent = {
          user_student_id: student.uid,
          task_id: postData[0].uid,
        };
        taskUserstudentsBodies.push(bodyForTaskUserstudent);
      }
      for (const bodyForTaskUserstudent of taskUserstudentsBodies) {
        const { data: TaskUserstudent, error: TaskUserstudentError } =
          await addTaskUserStudent_relation(bodyForTaskUserstudent);
        if (TaskUserstudentError) {
          console.log("error =====> ", TaskUserstudentError);
          return NextResponse.json(
            { message: "Error adding task-user student relation" },
            { status: 500 }
          );
        }
      }
    }

    // Create invoice
    // const err = await createNewInvoice(body, postData[0].uid);
    const devis = await createNewDevis(body, postData[0].uid);
    if (devis) {
      console.log(devis);
      return NextResponse.json({ message: "error" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Task-user worker relations added successfully" },
      { status: 201 }
    );
  }
  return NextResponse.json({ message: "error" }, { status: 500 });
}

async function deleteExistingTaskUserWorkerRelation(
  user_worker_id: string,
  task_id: string
) {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("task_user_worker")
    .delete()
    .eq("user_worker_id", user_worker_id)
    .eq("task_id", task_id);
  return { data, error };
}

async function exisitingTaskUserWorkers(taskId: string) {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("task_user_worker")
    .select("user_worker_id")
    .eq("task_id", taskId);
  return { data, error };
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const workers = body.workers;
  const {
    id,
    created_at,
    updated_at,
    user_id,
    dependecyTitle,
    uid,
    additional_cost,
    images,
    ...bodyWithoutWorkerId
  } = body;
  const { data: postData, error: postError } = await editTask(
    bodyWithoutWorkerId,
    uid
  );

  if (postData) {
    // Insert all task-user worker relations into the database
    if (workers) {
      const taskUserWorkerBodies = workers.map((worker: any) => ({
        user_worker_id: worker.uid,
        task_id: postData[0].uid,
      }));

      // Check if the worker is already in the task_user_worker table
      const { data: existingTaskUserWorkers, error: worker_relationerror } =
        await exisitingTaskUserWorkers(postData[0].uid);

      if (worker_relationerror) {
        return NextResponse.json(
          { message: "Error checking existing task-user worker relations" },
          { status: 408 }
        );
      }

      const existingUserWorkerIds = existingTaskUserWorkers?.map(
        (existing: any) => existing.user_worker_id
      );

      // Relations to add: workers not already in existingUserWorkerIds
      const relationsToAdd = taskUserWorkerBodies.filter(
        (body: any) => !existingUserWorkerIds?.includes(body.user_worker_id)
      );

      // Relations to delete: existing relations not in workers array
      const relationsToDelete = existingTaskUserWorkers?.filter(
        (existing: any) =>
          !workers.find((worker: any) => worker.uid === existing.user_worker_id)
      );

      for (const relationToDelete of relationsToDelete!) {
        const { data: deleteResult, error: deleteError } =
          await deleteExistingTaskUserWorkerRelation(
            relationToDelete.user_worker_id,
            postData[0].uid
          );

        if (deleteError) {
          return NextResponse.json(
            { message: "Error deleting existing task-user worker relation" },
            { status: 407 }
          );
        }
      }

      for (const bodyForTaskUserWorker of relationsToAdd) {
        const { data: TaskUserWorker, error: TaskUserWorkerError } =
          await addTaskUserWorker_relation(bodyForTaskUserWorker);

        if (TaskUserWorkerError) {
          return NextResponse.json(
            { message: "Error adding task-user worker relation" },
            { status: 402 }
          );
        }
      }
    }

    const devis = await createNewDevis(body, postData[0].uid);
    if (devis) {
      console.log(devis);
      return NextResponse.json({ message: "error" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Task-user worker relations added successfully" },
      { status: 201 }
    );
  }

  return NextResponse.json({ message: "error" }, { status: 405 });
}
