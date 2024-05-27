"use client";
import { Chip, styled } from "@mui/material";
import { type PaletteColor, type Theme } from "@mui/material";

interface CustomChipProps {
    customcolor?: PaletteColor;
}

const StyledChip = styled(Chip)<CustomChipProps>(
  ({theme, customcolor }) => ({
    color: customcolor ? customcolor.dark : theme.palette.primary.dark,
    "&.MuiChip-filled": {
      backgroundColor: customcolor ? customcolor.light : theme.palette.primary.light,
    },
    "&.MuiChip-outlined": {
      borderColor: customcolor ? customcolor.dark : theme.palette.primary.dark,
    },
    marginBottom: "8px",
  })
);



export default StyledChip;