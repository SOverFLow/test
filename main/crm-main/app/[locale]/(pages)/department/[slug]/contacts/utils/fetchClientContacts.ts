import { createClient } from "@/utils/supabase/client";
import { Contact } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { toast } from 'react-toastify';

async function ClientFetchContactLazy(
  department_id: string,
  count: number,
  page: number
): Promise<Contact[] | undefined> {
  const supabase = createClient();
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
    .range(count * page, page * count + count - 1);

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

async function fetchTotalContactsCount(department_id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Contact")
    .select("uid")
    .eq("department_id", department_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data.length;
}

interface ContactPayload {
  department_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
}

async function createContact(contactPayload: ContactPayload) {
  console.log("contactPayload", contactPayload);
  const supabase = createClient();
  const { data, error } = await supabase.from("Contact").insert({
    full_name: contactPayload.full_name,
    email: contactPayload.email,
    phone: contactPayload.phone,
    address: contactPayload.address,
    status: contactPayload.status,
    department_id: contactPayload.department_id,
  });
  if (error) {
    console.error('error contact', error);
    return error;
  }
  return data;
}

async function updateContact(
  contactPayload: ContactPayload,
  contactId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Contact")
    .update({ ...contactPayload })
    .eq("uid", contactId);
  if (error) {
    toast.error('Contact Error', {
      position: "bottom-right",
    });
    throw error;
  }
  toast.success('Contact Edited successfully', {
    position: "bottom-right",
  });
  return data;
}

export {
  fetchTotalContactsCount,
  ClientFetchContactLazy,
  createContact,
  updateContact,
};
