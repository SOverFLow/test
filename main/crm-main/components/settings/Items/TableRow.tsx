import {
  Grid,
  SxProps,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import React from "react";

export default function TableRow(props: {
  title: string;
  children: React.ReactNode;
  tooltip?: string;
  sxProps?: SxProps<Theme>;
  hasDivider?: boolean;
}) {
  return (
    <Grid
      container
      px={{ xs: 0, md: 2 }}
      sx={{
        display: "flex",
        flexDirection: "row",
        borderBottom: props.hasDivider ? "1px solid grey" : "none",
        borderColor: grey[200],
        my: 0,
        py: 0.5,
        ...props.sxProps,
      }}
    >
      <Grid
        item
        xs={4}
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Typography variant="body2">{props.title}</Typography>
        {props.tooltip && (
          <Tooltip title={props.tooltip}>
            <ErrorOutlinedIcon
              sx={{
                fontSize: 16,
                color: grey[500],
                ml: 1,
                cursor: "context-menu",
                "&:hover": {
                  cursor: "help",
                },
                // display: "none",
              }}
            />
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={8} xl={6}>
        {props.children}
      </Grid>
    </Grid>
  );
}
