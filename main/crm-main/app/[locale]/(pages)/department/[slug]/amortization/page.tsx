import { Box } from "@mui/material";
import fetchServerAmortization from "./utils/fetchServerAmortization";
import CreateAmortization from "./CreateAmortization";
import AmortizationTable from "./AmortizationTable";

export default async function Page({ params }: { params: { slug: string } }) {
  const initialAmortizationsData = await fetchServerAmortization(params.slug);
  return (
    <Box>
      <CreateAmortization />
      <AmortizationTable
        initialAmortizationData={initialAmortizationsData || []}
      />
    </Box>
  );
}
