import * as React from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "./types";
import { blue } from "@mui/material/colors";
import { useTranslations } from "next-intl";

export default function ProductCard(props: Product) {
  const t = useTranslations("Stock");
  return (
    <Card
      sx={{
        maxWidth: 250,
        m: 2,
        borderColor: blue[500],
        borderWidth: 1,
        borderRadius: 2,
        boxShadow: 3,
        "&&:hover": {
          backgroundColor: "#FEFFFF",
          transform: "scale(1.05)",
          transition: "0.5s",
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={props.imageUrl || "/images/product.png"}
        alt={props.name}
      />
      <CardContent
        sx={{
          background: "#F0F0F0FF",
          borderRadius: "4px",
          boxShadow: "0px 0px 1px #171a1f, 0px 0px 2px #171a1f",
        }}
      >
        <Typography gutterBottom variant="h6" component="div">
          {props.name}
        </Typography>
        <Box
          display={"flex"}
          gap={"1rem"}
          sx={{ flexDirection: { xs: "column", md: "row" } }}
        >
          <Box width={"100%"}>
            <Typography variant="body2" sx={{ color: "#000" }}>
              {"€" + props.price}
            </Typography>
          </Box>
          <Box width={"100%"}>
            <Typography variant="body2" color="text.secondary">
              {props.quantity + " " + t("units")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
