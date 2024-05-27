"use client";
import { lazy, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { StyledTypography } from "./components/utils";
import TaskChart from "./charts/TaskChart";
import DashboardCard from "./components/DashboardCard";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import {
  fetchClientCurrency,
  fetchDepartmentData,
  formatNumber,
} from "./utils/utils";

function retry(fn: any, retriesLeft = 5, interval = 1000): any {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const PaymentChartEarned = lazy(() =>
  retry(() => import("./charts/PaymentChart"))
);
const InvoiceChart = lazy(() => retry(() => import("./charts/invoiceChart")));
const HourlyDistrubution = lazy(() =>
  retry(() => import("./charts/HourlyDistrubution"))
);

import dynamic from "next/dynamic";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import Link from "next/link";
const DateFilter = dynamic(() => import("./components/DateFilter"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

export default function Dashboard() {
  const supabase = createClient();
  const t = useTranslations("Dashboard");
  const { slug } = useParams();

  const [cardData, setCardData] = useState([
    { title: t("cardTitle1"), value: "0 €", icon: "money", link: "invoices" },
    { title: t("cardTitle2"), value: "0", icon: "workers", link: "workers" },
    { title: t("cardTitle3"), value: "0", icon: "clients", link: "clients" },
    { title: t("cardTitle4"), value: "0", icon: "sales", link: "tasks" },
  ]);
  const [currency, setCurrency] = useState<string>("$");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("slug", slug);
      let symbol = "€";
      const userRole = (await supabase.auth.getUser()).data.user?.role;
      if (!userRole || !slug) {
        return [];
      }
      // console.log("userRole", userRole);
      setRole(userRole);
      const query = await getTablePermissionForSpecificRows(
        userRole,
        "Invoice",
        ["status", "invoice_price"]
      );
      const { data: invoices, error } = await supabase
        .from("Invoice")
        .select(query)
        .eq("department_id", slug)
        .eq("status", "paid");
      const data = invoices as any[];
      if (error) {
        console.log("error Invoice", error);
        return;
      } else if (data && data.length > 0) {
        // console.log("dat=====>a", data);
        fetchClientCurrency(slug).then((data) => {
          setCurrency(data as string);
          // console.log("data=?", data);
        });

        const totalEarnings = data.reduce(
          (acc, invoice) => acc + Number(invoice?.invoice_price),
          0
        );

        if (currency == "EUR") symbol = "€";
        else if (currency == "USD") symbol = "$";
        const formattedTotalEarnings =
          formatNumber(totalEarnings) + " " + symbol;
        setCardData((prevState) =>
          prevState.map((card) => {
            if (card.icon === "money") {
              return { ...card, value: formattedTotalEarnings };
            }
            return card;
          })
        );

        
      }
      fetchDepartmentData(slug).then((data) => {
        // console.log("data============>", data);
        setCardData((prevState: any) =>
          prevState.map((card: any) => {
            if (card.icon === "workers") {
              return { ...card, value: data?.info[0]?.count };
            } else if (card.icon === "clients") {
              return { ...card, value: data?.info[1]?.count };
            } else if (card.icon === "sales") {
              return { ...card, value: data?.info[2]?.count };
            }
            return card;
          })
        );
      });
    };

    fetchData();
  }, [slug, currency, supabase]);

  return (
    <Box
      sx={{
        // background: "#edf6f9",
        // padding: "20px",
        width: "100%",
        height: "100%",
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <StyledTypography variant="h5" align="left">
            {t("welcome")} 👋
          </StyledTypography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: "right", mb: 2 }}>
          <DateFilter />
        </Grid>
      </Grid>

      {role === "super_admin" && (
        <Grid container spacing={2}>
          {cardData.map((data, index) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
              <Link
                href={`/department/${slug}/${data.link}`}
                style={{ textDecoration: "none" }}
              >
                <DashboardCard
                  title={data.title}
                  value={data.value}
                  icon={data.icon}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
      {role === "super_admin" && (
        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            display={"flex"}
            justifyItems={"center"}
          >
            <PaymentChartEarned />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            display={"flex"}
            justifyItems={"center"}
          >
            <InvoiceChart Title={t("invoices-status-by-close-date")} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            display={"flex"}
            justifyItems={"center"}
          >
            <HourlyDistrubution />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={12} display={"flex"} justifyItems={"center"}>
          <TaskChart />
        </Grid>
      </Grid>
    </Box>
  );
}
