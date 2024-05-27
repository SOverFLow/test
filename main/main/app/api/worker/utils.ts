import { cache } from "react";
import getDbOnSeverDepartmentRole from "@/utils/supabase/cookie_department_role";
import { getDbOnSever } from "@/utils/supabase/cookie";
import treatRoleSubmit from "@/app/[locale]/(pages)/department/[slug]/workers/EditRole/treatRoleSubmit";

export const dynamic = "force-dynamic";


const resetPasswordForEmail = async (email:string,locale:string) => {
  const supabase = await getDbOnSever();
  return await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/${locale}/reset`,
})
};

export async function CreateUserWorker(
  email: string,
  password: string,
  UserWorker: any,
  allState: any
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      role: "worker",
    });

    if (error) {
      console.log("error:", error);
      return { user: null, error: error, code: 422 };
    }

    resetPasswordForEmail(email,'en');
    const { data, error: dataError } = await supabase
      .from("UserWorker")
      .insert({
        uid: user.user?.id,
        email: email,
        status: "confirmed",
        ...UserWorker,
      });
    if (dataError) {
      console.log("error: ", dataError);
      DeleteUserWorker(user.user?.id as string);
      return { user: null, error: dataError, code: 400 };
    }
    await treatRoleSubmit(
      allState.returnData,
      allState.selectedRole,
      user?.user?.id as string
    );
    return user;
  } catch (e) {
    console.log("error: ", e);
  }
}

export async function addDepartmentUserWorker_relation(body: any) {
  const addDepartmentUserWorker = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("department_user_worker")
      .insert([body]);
    return { data, error };
  });
  return await addDepartmentUserWorker();
}

export async function DeleteUserWorker(worker_id: string) {
  const supabase = await getDbOnSeverDepartmentRole();
  const { data: user, error } = await supabase.auth.admin.deleteUser(worker_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  const { data, error: dataError } = await supabase
    .from("UserWorker")
    .delete()
    .eq("uid", worker_id);

  if (dataError) {
    console.log("error: ", dataError);
    return { user: null, error: dataError, code: 500 };
  }
  return { user: null, code: 200 };
}

export async function EditUserWorker(
  email: string,
  user_id: string,
  UserWorker: any
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        email: email,
        email_confirm: true,
        role: "worker",
      }
    );

    if (error) {
      console.log("error: ", error);
      return { user: null, error: error, code: 422 };
    }

    const { data, error: dataError } = await supabase
      .from("UserWorker")
      .update({
        uid: user.user?.id,
        email: email,
        status: "active",
        ...UserWorker,
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
