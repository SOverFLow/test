import { cache } from "react";
import getDbOnSeverDepartmentRole from "@/utils/supabase/cookie_department_role";
import { getDbOnSever } from "@/utils/supabase/cookie";

export const dynamic = "force-dynamic";


const resetPasswordForEmail = async (email:string,locale:string) => {
  const supabase = await getDbOnSever();
  return await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/${locale}/reset`,
})
};

export async function CreateUserStudent(
  email: string,
  password: string,
  UserStudent: any,
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      role: "student",
    });

    if (error) {
      console.log("error:", error);
      return { user: null, error: error, code: 422 };
    }

    resetPasswordForEmail(email,'en');
    const { data, error: dataError } = await supabase
      .from("Student")
      .insert({
        uid: user.user?.id,
        email: email,
        status: "confirmed",
        ...UserStudent,
      });
    if (dataError) {
      console.log("error: ", dataError);
      DeleteUserStudent(user.user?.id as string);
      return { user: null, error: dataError, code: 400 };
    }
    return user;
  } catch (e) {
    console.log("error: ", e);
  }
}

export async function addDepartmentUserStudent_relation(body: any) {
  const addDepartmentUserStudent = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("department_user_student")
      .insert([body]);
    return { data, error };
  });
  return await addDepartmentUserStudent();
}

export async function DeleteUserStudent(student_id: string) {
  const supabase = await getDbOnSeverDepartmentRole();
  const { data: user, error } = await supabase.auth.admin.deleteUser(student_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  const { data, error: dataError } = await supabase
    .from("Student")
    .delete()
    .eq("uid", student_id);

  if (dataError) {
    console.log("error: ", dataError);
    return { user: null, error: dataError, code: 500 };
  }
  return { user: null, code: 200 };
}

export async function EditUserStudent(
  email: string,
  user_id: string,
  UserStudent: any
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        email: email,
        email_confirm: true,
        role: "student",
      }
    );

    if (error) {
      console.log("error: ", error);
      return { user: null, error: error, code: 422 };
    }

    const { data, error: dataError } = await supabase
      .from("Student")
      .update({
        uid: user.user?.id,
        email: email,
        status: "active",
        ...UserStudent,
      })
      .eq("uid", user_id);

    if (dataError) {
      console.log("error: ", dataError);
      return { user: null, error: dataError, code: 400 };
    }

    return user;
  } catch (e) {
    console.log("error: ", e);
  }
}
