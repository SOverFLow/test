"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { Box, Grid, Typography, styled, Skeleton } from "@mui/material";
import theme from "@/styles/theme";
import { createClient } from "@/utils/supabase/client";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const StyledBox = styled(Box)({
  background: "#ffffff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "1px 4px 5px 0px #eee",
});

const PaymentChart = ({
  dataFetched,
  currency,
  title,
  isLoading,
  invoicesFetched,
}: {
  dataFetched: {
    value: number;
    name: string;
    itemStyle: {
      color: string;
    };
  }[];
  currency: string;
  title: string;
  isLoading: boolean;
  invoicesFetched: number;
}) => {
  const chartRef = useRef(null);
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!isLoading && chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: "item",
          formatter: function (params: any) {
            return `${params.marker}${params.name}: ${params.value}${currency} (${params.percent}%)`;
          },
        },
        legend: {
          top: "0%",
          left: "center",
        },
        series: [
          {
            name: `${t('access-from')}`,
            type: "pie",
            radius: ["0%", "85%"],
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "inside",
              formatter: "{c}" + currency,
              fontSize: 13,
              fontWeight: "bold",
              color: "#fff",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
                color: "#fff",
              },
            },
            labelLine: {
              show: false,
            },
            data: dataFetched,
          },
        ],
      };

      myChart.setOption(option);

      myChart.on("click", function (params) {
        if (params.name === "Pending") {
          console.log("Pending clicked");
        } else if (params.name === "Paid") {
          console.log("Paid clicked");
        } else if (params.name === "Draft") {
          console.log("Draft clicked");
        }
      });

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        myChart.dispose();
      };
    }
  }, [dataFetched, isLoading, currency,t]);

  return (
    <StyledBox
      display={"flex"}
      justifyItems={"center"}
      justifyContent={"center"}
      sx={{ width: "100%" }}
    >
      <Grid container padding={0}>
        <Grid item xs={12}>
          <Typography style={{ color: theme.palette.text.secondary }}>
            <b>{t('invoices')}</b> : {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={"200px"} />
          ) : (
            <div ref={chartRef} style={{ width: "100%", height: "200px" }} />
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            style={{ color: theme.palette.text.secondary }}
            sx={{ display: "flex" }}
          >
            {t('total-invoice')}:{" "}
            {isLoading ? <Skeleton width="70%" /> : invoicesFetched}
          </Typography>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

const PaymentChartEarned = () => {
  const [dataFetched, setDataFetched] = useState([
    { value: 0, name: "Paid", itemStyle: { color: "#32a852" } },
    { value: 0, name: "Pending", itemStyle: { color: "#f5d000" } },
    { value: 0, name: "Draft", itemStyle: { color: "#cf1908" } },
  ]);
  const [currency, setCurrency] = useState<string>("$");
  const [isLoading, setIsLoading] = useState(true);
  const [invoicesFetched, setInvoicesFetched] = useState(0);
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("date")?.slice(0, 8) ?? new Date().toISOString();
  const endDate = searchParams.get("date")?.slice(9, 18) ?? new Date().toISOString();
  const t = useTranslations("dashboard");

  const parseData = useCallback((
    data: {
      status: string | null;
      invoice_price: number | null;
      currency: string | null;
    }[]
  ) => {
    const parsedData = {
      pending: 0,
      paid: 0,
      draft: 0,
    };
    data.forEach((invoice) => {
      if (invoice.status?.toLowerCase() === "pending") {
        parsedData.pending += invoice.invoice_price as number;
      } else if (invoice.status?.toLowerCase() === "paid") {
        parsedData.paid += invoice.invoice_price as number;
      } else if (invoice.status?.toLowerCase() === "draft") {
        parsedData.draft += invoice.invoice_price as number;
      }
    })

    setInvoicesFetched(data.length);
    return [
      {
        value: parseFloat(parsedData.paid.toFixed(2)),
        name: `${t('paid')}`,
        itemStyle: { color: "#32a852" },
      },
      {
        value: parseFloat(parsedData.pending.toFixed(2)),
        name: `${t('pending')}`,
        itemStyle: { color: "#f5d000" },
      },
      {
        value: parseFloat(parsedData.draft.toFixed(2)),
        name: `${t('draft')}`,
        itemStyle: { color: "#cf1908" },
      },
    ];
  }
  , [t]);


  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("Invoice")
        .select("status,invoice_price,currency")
        .eq("department_id", slug)
        .gte("date_issued", startDate)
        .lte("date_issued", endDate);
      if (error) {
        console.log("error", error);
        setIsLoading(false);
        return;
      }
      if (data && data.length > 0) {
        setCurrency((data[0].currency as string) || "$");
        setDataFetched(parseData(data));
      }
      setIsLoading(false);
    };

    fetchData();
  }, [slug, startDate, endDate,parseData]);

  return (
    <PaymentChart
      dataFetched={dataFetched}
      currency={currency}
      title={t('money-earned')}
      isLoading={isLoading}
      invoicesFetched={invoicesFetched}
    />
  );
};

export default PaymentChartEarned;
