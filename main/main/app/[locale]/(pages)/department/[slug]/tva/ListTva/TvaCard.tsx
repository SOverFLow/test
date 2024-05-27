"use client";
import { Box, Card, Chip, Typography } from "@mui/material";
import Tva from "../utils/tva.types";
import DeleteTva from "../DeleteTva";
import { useTranslations } from "next-intl";

export default function TvaCard({
  uid,
  name,
  description,
  country,
  value,
}: Tva) {
  const t = useTranslations("tva");
  return (
    <Card sx={{ padding: "14px", position: "relative" , background:'#EAF9FF',
    "&&:hover": {
      transform: "scale(1.05)",
      transition: "0.5s",
    }
    }}>
      <Box sx={{ position: "absolute", top: 10, right: -10 }}>
        <DeleteTva tvaId={uid} />
      </Box>

      <Typography color={"text.primary"} variant="h1" fontSize={"1.2rem"}>
        {name}
      </Typography>
      {description ? (
        <Typography
          noWrap
          sx={{ textOverflow: "ellipsis", width: "100%" }}
          color={"text.secondary"}
          mt={2}
        >
          {description}
        </Typography>
      ) : (
        <Typography color={"gray"} mt={2}>
          {t('no-description')}
        </Typography>
      )}

      <Chip label={value + " %"}  sx={{
        marginRight: 2,
        backgroundColor: '#fff',
        color: '#6CB1CB',
      
      }} color="default" />

      {country && (
         <Chip label={country}   color='default' sx={{backgroundColor:'#fff', color: '#6CB1CB',}} />
      )}
    </Card>
  );
}
