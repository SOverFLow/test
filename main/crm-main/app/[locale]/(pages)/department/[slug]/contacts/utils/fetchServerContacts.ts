import { getDbOnSever } from "@/utils/supabase/cookie";
import { Contact } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerContacts(
  department_id: string
): Promise<Contact[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Contact", ["uid", "full_name", "email", "phone", "address", "status", "created_at"]);
  const { data, error } = await supabase
    .from("Contact")
    .select(query)
    .eq("department_id", department_id)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    console.log("error: ", error);
    return;
  }
  const contacts = data.map((contact : any) => {
    return {
      uid: contact.uid,
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      status: contact.status,
      created_at: contact.created_at,
    };
  });
  return contacts;
}
export default fetchServerContacts;
