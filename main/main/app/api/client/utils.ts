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

export async function CreateUserClient(
  email: string,
  password: string,
  UserClient: any
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      role: "client",
    });

    if (error) {
      console.log("error: ", error);
      return { user: null, error: error, code: 422 };
    }

    resetPasswordForEmail(email,'en');
    
    const { data, error: dataError } = await supabase.from("Client").insert({
      uid: user.user?.id,
      email: email,
      status: "confirmed",
      ...UserClient,
    });

    if (dataError) {
      console.log("error: ", dataError);
      DeleteUserClient(user.user?.id as string);
      return { user: null, error: dataError, code: 400 };
    }

    return user;
  } catch (e) {
    console.log("error: ", e);
  }
}

export async function addDepartmentClient_relation(body: any) {
  const addDepartmentClient = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("client_department")
      .insert([body]);
    return { data, error };
  });
  return await addDepartmentClient();
}


export async function addClientToBien(client_id: string, bien_id: string) {
  const add = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("Bien")
      .update({client_id})
      .eq("uid", bien_id);
    return { data, error };
  });
  return await add();
}

export async function DeleteUserClient(client_id: string) {
  const supabase = await getDbOnSeverDepartmentRole();
  const { data: user, error } = await supabase.auth.admin.deleteUser(client_id);
  if (error) {
    console.log("error: ", error);
    return { user: null, error: error, code: 500 };
  }
  const { data, error: dataError } = await supabase
    .from("Client")
    .delete()
    .eq("uid", client_id);

  if (dataError) {
    console.log("error: ", dataError);
    return { user: null, error: dataError, code: 500 };
  }
  return { user: null, code: 200 };
}

export async function EditUserClient(
  email: string,
  user_id: string,
  UserClient: any
) {
  const supabase = await getDbOnSeverDepartmentRole();
  try {
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        email: email,
        email_confirm: true,
        role: "client",
      }
    );

    if (error) {
      console.log("error: ", error);
      return { user: null, error: error, code: 422 };
    }

    const { data, error: dataError } = await supabase
      .from("Client")
      .update({
        uid: user.user?.id,
        email: email,
        status: "active",
        ...UserClient,
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


export async function addServiceUserClient_relation(body: any) {
  const addServiceUserClient = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("service_user_client")
      .insert([body]);
    return { data, error };
  });
  return await addServiceUserClient();
}

export async function addContractUserClient_relation(body: any) {
  const addContractUserClient = cache(async () => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("contract_user_client")
      .insert([body]);
    return { data, error };
  });
  return await addContractUserClient();
}