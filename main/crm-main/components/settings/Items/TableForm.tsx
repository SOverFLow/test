import { Grid, Typography } from "@mui/material";
import React from "react";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import { cyan } from "@mui/material/colors";
export default function TableForm(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          px: "1rem",
          alignItems: "center",
          backgroundColor: cyan[50],
          border: "1px solid grey",
          borderLeft: "0 solid #F5F5F5",
          borderRight: "0 solid #F5F5F5",
        }}
      >
        <BusinessCenterOutlinedIcon
          sx={{ fontSize: 32, color: "#424240", my: 0.5 }}
        />
        <Typography variant="subtitle1">{props.title}</Typography>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "white",
        }}
      >
        {props.children}
      </Grid>
    </Grid>
  );
}
