import { NextRequest, NextResponse } from "next/server";
import { CreateUserStudent, DeleteUserStudent, EditUserStudent, addDepartmentUserStudent_relation } from "./utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, department_id, ...bodyWithouemail } = body;
  try {
    const postData = await CreateUserStudent(
      email,
      password,
      bodyWithouemail,
    );

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      const bodyForDepartmentUserStudent = {
        department_id: department_id,
        user_student_id: postData.user?.id,
      };

      await addDepartmentUserStudent_relation(bodyForDepartmentUserStudent);

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
  let { student_id } = body;


  console.log("student_id", student_id);
  

  try {
    if (!Array.isArray(student_id)) {
      student_id = [student_id];
    }
    for (const studentId of student_id) {
      const postData = await DeleteUserStudent(studentId);
      
      if (postData && 'error' in postData) {
        return NextResponse.json(
          { message: postData.error },
          { status: postData.code }
        );
      }
    }
    return NextResponse.json({ message: 'Students deleted' }, { status: 200 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { email, user_id, ...bodyWithouemail } = body;

  try {
    const postData = await EditUserStudent(email, user_id, bodyWithouemail);

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
