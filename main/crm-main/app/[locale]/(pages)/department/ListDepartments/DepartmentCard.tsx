"use client";
import {
  Box,
  Card,
  styled,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import type DepartmentType from "../utils/department.types";
import StyledChip from "@/components/ui/StyledChip";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: "1rem",
  borderRadius: ".4rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: theme.palette.card?.main,
  "&:hover": {
    backgroundColor: theme.palette.card?.light,
  },
}));

const StyledIcon = styled(SvgIcon)(({ theme }) => ({
  transition: theme.transitions.create(["all", "transform"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    transform: "translateX(4px)",
  },
}));

export default function DepartmentCard({
  uid,
  title,
  description,
  created_at,
}: DepartmentType) {
  const theme = useTheme();
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(formatDate(new Date(created_at)));
  }, [created_at]);

  return (
    <Link href={`department/${uid}/dashboard`}>
      <StyledCard>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"text.primary"}
        >
          <Typography color={"text.primary"} variant="h1" fontSize={"1.3rem"}>
            {title}
          </Typography>
          <StyledIcon fontSize="inherit" color="inherit">
            <ArrowForwardIosIcon />
          </StyledIcon>
        </Box>
        {description ? (
          <Typography color={"text.secondary"} fontSize={".92rem"} mt={0.6}>
            {description.length > 80
              ? description.slice(0, 80) + "..."
              : description}
          </Typography>
        ) : (
          <Typography color={"gray"} fontSize={".92rem"} mt={0.6}>
            no description was provided
          </Typography>
        )}
        <StyledChip
          customcolor={theme.palette.card}
          sx={{ display: "flex", float: "right", mt: 1 }}
          label={date}
        />
      </StyledCard>
    </Link>
  );
}
