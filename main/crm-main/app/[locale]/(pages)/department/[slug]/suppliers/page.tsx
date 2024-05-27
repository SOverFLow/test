import { Box } from "@mui/material";
import fetchServerSuppliers from "./utils/fetchServerSuppliers";
import SuppliersTable from "./SuppliersTable";
import CreateSupplier from "./CreateSupplier";


export default async function Suppliers({
  params,
}: {
  params: { slug: string };
}) {
  const SuppliersData = await fetchServerSuppliers(params.slug);
  return (
    <>
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <CreateSupplier/>
      </Box>

      <Box>
        <SuppliersTable SupplierData={SuppliersData || []} />
      </Box>
    </>
  );
}