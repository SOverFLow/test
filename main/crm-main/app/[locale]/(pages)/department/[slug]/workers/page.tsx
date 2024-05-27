import { Box } from "@mui/material";
import fetchServerWorkers, { fetchCurrency } from "./utils/fetchServerWorkers";
import WorkersTable from "./WorkerTable";
import WorkerWrapper from "./WorkerWrapper";

export default async function Workers({
  params,
}: {
  params: { slug: string };
}) {
  const workersData = await fetchServerWorkers(params.slug);
  let currency = await fetchCurrency(params.slug);

  if (currency == "EUR") currency = "€";
  else if (currency == "USD") currency = "$";

  return (
    <>
      <WorkerWrapper />
      <Box>
        <WorkersTable workerData={workersData || []} currency={currency} />
      </Box>
    </>
  );
}
