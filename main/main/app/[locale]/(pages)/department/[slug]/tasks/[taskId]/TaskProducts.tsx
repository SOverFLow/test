"use client";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function TaskProducts({ products }: { products: any[] }) {
  const t = useTranslations("Task");
  return (
    <Box mt={"1rem"}>
      <Typography variant="h5" fontWeight={"semi-bold"}>
        {t("products")}
      </Typography>
      <Box ml={".4rem"} mt={"0"} sx={{ marginTop: 0 }}>
        {products.length ? products.map((product) => (
          <Box
            key={product.uid}
            sx={{ flexDirection: "column", alignItems: "start" }}
          >
            <Typography variant="h5" fontSize={"1.2rem"}>
              {product.name}
            </Typography>
            <Typography
              fontSize={".8rem"}
              fontWeight={"semi-bold"}
              ml={".4rem"}
            >
              {t("title")}: {product.price}$
            </Typography>
            <Typography
              fontSize={".8rem"}
              fontWeight={"semi-bold"}
              ml={".4rem"}
            >
              {t("refrence")}: {product.reference}
            </Typography>
          </Box>
        )) : (<Typography ml={".4rem"} variant="h6" fontSize={"1rem"} color={"dimgray"}>No products</Typography>)}
      </Box>
    </Box>
  );
}
