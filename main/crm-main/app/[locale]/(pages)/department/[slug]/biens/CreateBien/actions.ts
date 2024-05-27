"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

// create a new bien
const createBien = async (department_id: string, formData: any) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  console.log("formData", formData);
  // const [newBien, setNewBien] = useState({
  //   name: "",
  //   type: "",
  //   price: 0,
  //   description: "",
  //   location: address,
  //   zip_code: "",
  //   city: "",
  //   state_province: "",
  //   country: "",
  //   phone: "",
  //   status: "",
  //   client: {
  //     uid: "",
  //     name: "",
  //   },
  // });

  const { data, error } = await supabase
    .from("Bien")
    .insert({
      name: formData.name,
      type: formData.type,
      // price: formData.price,
      description: formData.description,
      location: formData.location,
      zip_code: formData.zip_code,
      city: formData.city,
      state_province: formData.state_province,
      country: formData.country,
      phone: formData.phone,
      status: formData.status,
      client_id: formData.client.uid,
      department_id: department_id,
    })
    .select("uid");
  if (error) {
    console.error("Error inserting data", error);
    return { error: error.message };
  }
  return formData;
};

export default createBien;

// get all clients in a department
export async function getDepartementClients(department_id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: ClientData, error: error } = await supabase
    .from("Department")
    .select("client_department(Client(*))")
    .eq("uid", department_id)
    .single();
  if (ClientData) {
    const clients = ClientData.client_department.map((client: any) => {
      return {
        uid: client.Client?.uid ?? "",
        name: client.Client?.first_name + " " + client.Client?.last_name,
      };
    });
    return {
      data: clients,
    };
  } else {
    return {
      error: error.message,
    };
  }
}
