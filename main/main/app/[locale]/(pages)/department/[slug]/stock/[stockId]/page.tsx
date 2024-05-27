import { getDbOnSever } from "@/utils/supabase/cookie";
import { Box, Grid, Typography } from "@mui/material";
import StockDetails from "./StockDetails";
import ProductCard from "./ProductCard";
import { getTranslations } from "next-intl/server";

const fetchServerStock = async (stockId: string) => {
  const supabase = await getDbOnSever();
  const res: any = await supabase
    .from("Stock")
    .select("*")
    .eq("uid", stockId)
    .single();
  if (res.error) {
    console.log("error: ", res.error);
    return;
  }
  if (!res.data) {
    console.log("stock not found!");
    return;
  }
  return {
    name: res.data.name,
    created_at: res.data.created_at,
    expiry_date: res.data.expiry_date,
    location: res.data.location,
    owner: res.data.owner,
    payment_method: res.data.payment_method,
    purchase_date: res.data.purchase_date,
    type: res.data.type,
    uid: res.data.uid,
  };
};

const fetchServerProducts = async (stockId: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Product")
    .select("uid, name, image, buy_price, quantity, stock_id")
    .eq("stock_id", stockId);

  if (error) {
    console.log("error: ", error);
    return;
  }
  if (!data) {
    console.log("stock not found!");
    return;
  }

  const products = data.map((product) => {
    return {
      uid: product.uid,
      name: product.name,
      quantity: product.quantity,
      imageUrl: product.image,
      price: product.buy_price,
    };
  });
  return products;
};

export default async function Page({
  params,
}: {
  params: { stockId: string };
}) {
  const stock = await fetchServerStock(params.stockId);
  const products = await fetchServerProducts(params.stockId);
  // const t = useTranslations("Stock");
  const t = await getTranslations("Stock");

  if (!stock) {
    return <Box>{t("stock-not-found")}</Box>;
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StockDetails {...stock} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontSize: "1.5rem",
            lineHeight: "26px",
            fontWeight: 400,
            color: "#171A1FFF",
          }}
        >
          {t("products")}
        </Typography>
        <Grid container spacing={2}>
          {products &&
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product.uid}>
                <ProductCard {...product} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
