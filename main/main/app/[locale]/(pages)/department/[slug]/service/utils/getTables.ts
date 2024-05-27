import { createClient } from "@/utils/supabase/client";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

const supabase = createClient();

export async function getBiens(department_id: string, client_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(user.role, "Bien", [
    "uid",
    "name",
  ]);
  const { data: BienData, error } = await supabase
    .from("Bien")
    .select(query)
    .eq("department_id", department_id)
    .eq("client_id", client_id);
  if (error) {
    console.log("error Bien: ", error);
  }
  if (BienData) {
    const biens = BienData.map((bien) => {
      return {
        uid: (bien as { uid?: string }).uid ?? "",
        name: (bien as { name?: string }).name ?? "",
      };
    });
    console.log("biens ==========>", biens);
    return biens;
  }

  return [];
}

export async function getTva(department_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(user.role, "TVA", [
    "uid",
    "name",
    "value",
  ]);
  const { data: TvaData, error } = await supabase
    .from("TVA")
    .select(query)
    .eq("department_id", department_id);
  if (TvaData) {
    const tvas = TvaData.map((tva) => {
      return {
        uid: (tva as { uid?: string }).uid ?? "",
        name: (tva as { name?: string }).name ?? "",
        value: (tva as { value?: number }).value ?? 0,
      };
    });
    return tvas;
  }

  return [];
}
export async function getFamily(department_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(user.role, "ServiceFamily", [
    "name",
  ]);
  const { data, error } = await supabase
    .from("ServiceFamily")
    .select(query)
    .eq("department_id", department_id);
  if (data) {
    const families = data.map((family) => {
      return {
        name: (family as { name?: string }).name ?? "",
      };
    });
    return families;
  }

  return [];
}

export async function getClients(department_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Client", [
    "uid",
    "first_name",
    "last_name",
  ]);

  const { data: ClientData, error: ClientError } = await supabase
    .from("client_department")
    .select(`Client(${query})`)
    .eq("department_id", department_id);

  if (ClientData) {
    const clients = ClientData.map((client: any) => {
      return {
        uid: client.Client.uid ?? "",
        first_name: client.Client.first_name ?? "",
        last_name: client.Client.last_name ?? "",
      };
    });
    return clients;
  }

  return [];
}
