"use client";
import * as React from "react";
// import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import * as echarts from "echarts";
import BarInvoiceChart from "../components/barInvoiceChart";
import getInvoinces from "@/app/api/dashboard/actions/get_invoices";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useTransition } from "react";
import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
interface props {
  Title: string;
}

const StyledBox = styled(Box)({
  background: "#ffffff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "1px 4px 5px 0px #eee",
});

type chartData = {
  Jan: { paid: number; pending: number; draft: number };
  Feb: { paid: number; pending: number; draft: number };
  Mar: { paid: number; pending: number; draft: number };
  Apr: { paid: number; pending: number; draft: number };
  May: { paid: number; pending: number; draft: number };
  Jun: { paid: number; pending: number; draft: number };
  Jul: { paid: number; pending: number; draft: number };
  Aug: { paid: number; pending: number; draft: number };
  Sep: { paid: number; pending: number; draft: number };
  Oct: { paid: number; pending: number; draft: number };
  Nov: { paid: number; pending: number; draft: number };
  Dec: { paid: number; pending: number; draft: number };
};

export default function InvoiceChart(props: props) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const department_id = useSelector(
    (state: RootState) => state.departmentSlice?.value?.uid
  );
  const [chartData, setChartData] = React.useState<chartData>({
    // add year to chartData
    Jan: { paid: 0, pending: 0, draft: 0 },
    Feb: { paid: 0, pending: 0, draft: 0 },
    Mar: { paid: 0, pending: 0, draft: 0 },
    Apr: { paid: 0, pending: 0, draft: 0 },
    May: { paid: 0, pending: 0, draft: 0 },
    Jun: { paid: 0, pending: 0, draft: 0 },
    Jul: { paid: 0, pending: 0, draft: 0 },
    Aug: { paid: 0, pending: 0, draft: 0 },
    Sep: { paid: 0, pending: 0, draft: 0 },
    Oct: { paid: 0, pending: 0, draft: 0 },
    Nov: { paid: 0, pending: 0, draft: 0 },
    Dec: { paid: 0, pending: 0, draft: 0 },
  });
  useEffect(() => {
    async function getData() {
      if (!department_id) return;
      // console.log("departmentId", department_id);
      startTransition(() => {
        getInvoinces(department_id, year.toString()).then((data) => {
          if (data.data) {
            // console.log(data.data);
            setChartData(data.data as chartData); // Add type assertion to chartData
            return;
          }
          console.error(data.error);
        });
      });
    }
    getData();
  }, [department_id, year]);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (date) {
      setYear(date.year());
      // console.log("date.year()", date.year());
    }
  };

  return (
    <StyledBox
      display={"flex"}
      flexDirection={"column"}
      justifyItems={"center"}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          mx: 2,
        }}
      >
        <Typography style={{ color: theme.palette.text.secondary }}>
          {props.Title}
        </Typography>
        <DatePicker
          onChange={onChange}
          picker="year"
          disabledDate={(current) => {
            return current && current > dayjs().endOf("year");
          }}
          defaultValue={dayjs(year.toString(), "YYYY")}
        />
      </Box>
      <BarInvoiceChart data={chartData} title={props.Title} />
    </StyledBox>
  );
}
