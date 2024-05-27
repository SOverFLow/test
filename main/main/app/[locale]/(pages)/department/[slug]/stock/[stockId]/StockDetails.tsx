import * as React from "react";
import { Typography, Grid, Box } from "@mui/material";
import { StockItem } from "./types";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PaymentIcon from "@mui/icons-material/Payment";
import { green, blue, orange, purple } from "@mui/material/colors";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import WarehouseIcon from "@mui/icons-material/Warehouse";
export default function StockDetails(props: StockItem) {
  // const t = await getTranslations("Stock");
  const t = useTranslations("Stock");

  return (
    <Box>
      <Typography
        variant="h3"
        mt={3}
        sx={{
          fontSize: "32px",
          lineHeight: "48px",
          fontWeight: 700,
          color: "#171A1FFF",
        }}
      >
        {t("stock-details")}
      </Typography>
      <Box
        sx={{
          background: "#F0F0F0FF",
          borderRadius: "4px",
          borderWidth: "1px",
          borderColor: "#BDC1CAFF",
          borderStyle: "solid",
          boxShadow: "0px 0px 1px #171a1f, 0px 0px 2px #171a1f",
          p: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: "21px",
            lineHeight: "32px",
            fontWeight: 700,
            color: "#171A1FFF",
          }}
        >
          {props.name}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: "15px",
            lineHeight: "24px",
            fontWeight: 400,
            color: "#171A1FFF",
          }}
        >
          {props.location}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            fontSize: "11px",
            lineHeight: "18px",
            fontWeight: 400,
            color: "#171A1FFF",
          }}
        >
          {props.created_at.slice(0, 10)}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <WarehouseIcon />
                  <Typography variant="subtitle1">{t("stock-type")}</Typography>
                  <Typography variant="body2">{props.type}</Typography>
                </Grid>

                {/* <Grid item>
                  <PersonIcon />
                  <Typography variant="subtitle1">{t("owner")}</Typography>
                  <Typography variant="body2">{props.owner}</Typography>
                </Grid> */}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <PaymentIcon />
                  <Typography variant="subtitle1">
                    {t("payment-method")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: orange[500],
                    }}
                  >
                    <Typography variant="body2">
                      {props.payment_method}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <DateRangeIcon />
                  <Typography variant="subtitle1">
                    {t("purchase-date")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: purple[500],
                    }}
                  >
                    <Typography variant="body2">
                      {props.purchase_date}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
