import { Box } from "@mui/material";
import ContactsTable from "./ContactsTable";
import fetchServerContacts from "./utils/fetchServerContacts";
import CreateContact from "./CreateContact";


export default async function Page({ params }: { params: { slug: string } }) {
  const initialContactsData = await fetchServerContacts(params.slug);
  return (
    <Box>
      <CreateContact />
      <ContactsTable initialContactsData={initialContactsData || []} />
    </Box>
  );
}