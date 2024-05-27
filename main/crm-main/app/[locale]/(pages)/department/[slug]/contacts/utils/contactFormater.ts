import { Database } from "@/types/supabase";
import { Contact } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";
import formatDate from "@/utils/formatDate";

export function payloadToContact(
  contact: any,
): Contact {
  return {
    id : contact.id,
    uid: contact.uid,
    full_name: contact.full_name,
    email: contact.email,
    address: contact.address,
    phone: contact.phone,
    status: contact.status,
    created_at: contact.created_at,
  };
}

export function payloadToContactData(
  contact: any,
) {
  return {
    id: contact.uid,
    col1: contact.full_name,
    col2: contact.email || "No email",
    col3: contact.phone || "No phone",
    col4: contact.address || "No address",
    col5: formatDate(new Date(contact.created_at)),
    col6: [contact.status || "No status", contact.uid],
    col7: contact,
  };
}
