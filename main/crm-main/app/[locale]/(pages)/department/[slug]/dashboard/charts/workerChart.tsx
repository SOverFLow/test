"use client";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

interface props {
  Title: string;
}

const StyledBox = styled(Box)({
  background: "#ffffff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "1px 4px 5px 0px #eee",
});

const data = [1, 2, 3, 2, 1];

export default function WorkerChart(props: props) {
  const theme = useTheme();
  return (
    <StyledBox display={"flex"} justifyItems={"center"} sx={{ width: "100%" }}>
      <Typography style={{ color: theme.palette.text.secondary }}>
        {props.Title}
      </Typography>
      <BarChart
        series={[
          {
            data,
          },
        ]}
        height={300}
        width={300}
      />
    </StyledBox>
  );
}
