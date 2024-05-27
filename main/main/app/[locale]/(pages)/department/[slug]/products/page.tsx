import { Box } from "@mui/material";
import fetchServerProducts from "./utils/fetchServerProducts";
import ProductsTable from "./ProductsTable";

export default async function Products({
  params,
}: {
  params: { slug: string };
}) {
  const ProductsData = await fetchServerProducts(params.slug);
  return (
    <Box>
      <ProductsTable ProductsData={ProductsData || []} />
    </Box>
  );
}
