"use client";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface TaskCosts {
  uid: string;
  name: string;
  price: number;
  date_issued: string | null;
  status: string;
  type: string;
  description: string | null;
}

export default function TaskPrice({
  taskPrice,
  taskCosts,
  sx,
}: {
  taskPrice: number;
  taskCosts: TaskCosts[];
  sx?: any;
}) {
  const t = useTranslations("Task");
  const aditionalCostsPrice = useMemo(() => {
    return taskCosts.reduce(
      (acc: number, cost: TaskCosts) => acc + cost.price,
      0
    );
  }, [taskCosts]);

  return (
    <Box mt={"1rem"} sx={sx}>
      <Typography variant="h5" fontWeight={"semi-bold"}>
        {t("price")}
      </Typography>
      <Box display={"flex"} gap={"2rem"}>
        <Typography color={"success.main"} fontWeight={"bold"} ml={".4rem"}>
          Base Price: {taskPrice}$
        </Typography>
        <Typography color={"error.main"} fontWeight={"bold"} ml={".4rem"}>
          Aditional Costs: {aditionalCostsPrice}$
        </Typography>
      </Box>
    </Box>
  );
}
