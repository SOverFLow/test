import { NextRequest, NextResponse } from "next/server";
import {
  CreateUserWorker,
  DeleteUserWorker,
  EditUserWorker,
  addDepartmentUserWorker_relation,
} from "./utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, department_id, allState, ...bodyWithouemail } = body;
  try {
    const postData = await CreateUserWorker(
      email,
      password,
      bodyWithouemail,
      allState
    );

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      const bodyForDepartmentUserWorker = {
        department_id: department_id,
        user_worker_id: postData.user?.id,
      };

      await addDepartmentUserWorker_relation(bodyForDepartmentUserWorker);

      return NextResponse.json({ message: { postData } }, { status: 201 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { worker_id } = body;

  try {
    const postData = await DeleteUserWorker(worker_id);

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      return NextResponse.json({ message: "Worker deleted" }, { status: 200 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { email, user_id, ...bodyWithouemail } = body;

  try {
    const postData = await EditUserWorker(email, user_id, bodyWithouemail);

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      return NextResponse.json({ message: { postData } }, { status: 200 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
