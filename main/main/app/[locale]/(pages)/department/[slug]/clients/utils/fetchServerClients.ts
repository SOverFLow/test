import { getDbOnSever } from "@/utils/supabase/cookie";
import { UserClient } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerClients(
  department_id: string
): Promise<UserClient[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Client", [
    "uid",
    "email",
    "first_name",
    "last_name",
    "phone",
    "avatar",
    "status",
    "created_at",
    "updated_at",
    "id",
  ]);

  const { data, error } = await supabase
    .from("Department")
    .select(`client_department(Client(${query}))`)
    .eq("uid", department_id)
    .limit(25)
    .single();

  if (error) {
    console.log("error: ", error);
    return;
  }

  // @ts-ignore
  const Clients = data.client_department.map((client: any) => {
    return {
      uid: client.Client?.uid ?? "",
      email: client.Client?.email ?? "",
      first_name: client.Client?.first_name ?? "",
      last_name: client.Client?.last_name ?? "",
      phone: client.Client?.phone ?? "",
      avatar: client.Client?.avatar ?? "/images/profile.png",
      status: client.Client?.status ?? "",
      created_at: client.Client?.created_at ?? "",
      updated_at: client.Client?.updated_at ?? "",
      id: client.Client?.id ?? 0,
      contract: client.Client?.contract ?? "No contract",
    };
  });
  return Clients;
}

export default fetchServerClients;
