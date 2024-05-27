import { createClient } from "@/utils/supabase/client";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";

const supabase = createClient();

export async function ClientFetchContract(department_id: string, client_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissions(
    user.role,
    "Contract",
    "uid,name",
    []
  );
  const { data, error } = await supabase
    .from("Contract")
    .select(query)
    .eq("department_id", department_id)
    .eq("client_id", client_id)

  if (error) {
    console.log("error: ", error);
    return [];
  }
  if (!data) {
    return [];
  }
  const contracts = data?.map((contract: any) => {
    return {
      uid: contract.uid,
      title: contract?.name,
    };
  });
  console.log("contracts", contracts);
  return contracts;
}


export async function ClientFetchService(department_id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.role) {
      console.log("user role not found");
      return;
    }
  
    const query = await getTablePermissions(
      user.role,
      "Service",
      "uid,title",
      [
      ]
    );
  
    const { data, error } = await supabase
      .from("Service")
      .select(query)
      .eq("department_id", department_id);
  
    if (error) {
      console.log("error: ", error);
      return;
    }
    const Services = data.map((service: any) => {
      return {
        uid: service.uid,
        title: service.title,
      };
    });
    return Services;
  }
