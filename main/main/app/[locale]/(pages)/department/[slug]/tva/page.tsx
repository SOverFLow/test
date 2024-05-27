import { Box } from "@mui/material";
import { fetchTva } from "./utils/fetchTva";
import ListTva from "./ListTva";
import CreateTva from "./CreateTva";

export default async function Tva({
  params,
}: {
  params: { slug: string };
}) {
  const tva = await fetchTva(params.slug);
  return (
    <Box mt={4}>
      <CreateTva/>
      <ListTva tvaList={tva || []} department_id={params.slug}/>
    </Box>
  );
}