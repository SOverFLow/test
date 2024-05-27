import { Box } from "@mui/material";
import fetchServerClients from "./utils/fetchServerClients";
import ClientTable from "./ClientTable";
import ClientWrapper from "./ClientWrapper";

export default async function Clients({
  params,
}: {
  params: { slug: string };
}) {
  
  const ClientsData = await fetchServerClients(params.slug);
  
  
  return (
    <>
      <ClientWrapper />

      <Box>
        <ClientTable clientData={ClientsData || []} />
      </Box>
    </>
  );
}
