import { Box } from "@mui/material";
import fetchServerBiens from "./utils/fetchServerBiens";
import BiensTable from "./BiensTable";
import CreateBien from "./CreateBien";

export default async function Suppliers({
  params,
}: {
  params: { slug: string };
}) {
  const biensData = await fetchServerBiens(params.slug);
  return (
    <>
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <CreateBien />
      </Box>
      <Box>
        <BiensTable biensData={biensData || []} />
      </Box>
    </>
  );
}
