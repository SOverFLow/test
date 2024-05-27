"use client";
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
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

export default function ClientChart(props: props) {
  const theme = useTheme();
  return (
    <StyledBox display={"flex"} justifyItems={"center"} sx={{ width: "100%" }}>
      <Typography style={{ color: theme.palette.text.secondary }}>
        {props.Title}
      </Typography>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
        series={[
          {
            data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
            showMark: ({ index }) => index % 2 === 0,
          },
        ]}
        width={300}
        height={300}
      />
    </StyledBox>
  );
}
