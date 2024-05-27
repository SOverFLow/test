'use client';
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";


export const StyledTypography = styled(Typography) (({ theme }) => ({
    marginTop: 20,
    fontWeight: "bold",
    color: theme.palette.text.primary,
    marginBottom: 20,
  }));