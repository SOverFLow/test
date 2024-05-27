import { getDbOnSever } from "@/utils/supabase/cookie";
import { NextRequest, NextResponse } from "next/server";
import { addTask_draft, addTaskDraftUserStudent_relation, addTaskDraftUserWorker_relation } from "../task/utils";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const workers = body.workers;
    // console.log("body", body)
    const { additional_cost, students, dates, ...bodyWithoutWorkerId } = body;

    const supabase = await getDbOnSever();
    const { data: existingDrafts, error: fetchError } = await supabase
        .from("task_draft")
        .select("uid")
        .eq("user_id", body.user_id);

    if (fetchError) {
        console.error("Error fetching existing drafts: ", fetchError);
        return NextResponse.json({ message: "Error fetching existing drafts" }, { status: 500 });
    }

    // Delete existing drafts and their relations if any
    if (existingDrafts?.length > 0) {
        const draftIds = existingDrafts.map(draft => draft.uid);

        const { error: deleteError } = await supabase
            .from("task_draft")
            .delete()
            .in("uid", draftIds);

        if (deleteError) {
            console.error("Error deleting existing drafts: ", deleteError);
            return NextResponse.json({ message: "Error deleting existing drafts" }, { status: 500 });
        }
    }

    const { data: postData, error: postError } = await addTask_draft(
        bodyWithoutWorkerId
    );

    console.log("err", postError)
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
                    await addTaskDraftUserWorker_relation(bodyForTaskUserWorker);
                if (TaskUserWorkerError) {
                    return NextResponse.json({ message: "Error adding task-user worker relation" }, { status: 500 });
                }
            }
        }

        if (students) {
            console.log("students", students)
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
                    await addTaskDraftUserStudent_relation(bodyForTaskUserstudent);
                if (TaskUserstudentError) {
                    console.log("error =====> ", TaskUserstudentError)
                    return NextResponse.json({ message: "Error adding task-user student relation" }, { status: 500 });
                }
            }
        }

        return NextResponse.json({ message: "Task-user worker relations added successfully" }, { status: 201 });
    }
    return NextResponse.json({ message: "error" }, { status: 500 });
}