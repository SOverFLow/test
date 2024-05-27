"use client";
import { Box, Grid } from "@mui/material";
import Chart from "./Chart";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import surpressWarn from "@/utils/surpressWarn";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import fetchClientTasks from "./utils/FetchTasks";
import WraperOfTasks from "../../components/WraperOfTasks";
import PieTaskChart from "./PieTaskChart";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
const DatePicker = dynamic(() => import("../../components/DatePicker"), {
  ssr: false,
});

export default function TaskChart({}) {
  surpressWarn();
  const serchParams = useSearchParams();
  const startDate = serchParams.get("date")?.slice(0, 8)!;
  const endDate = serchParams.get("date")?.slice(9, 18)!;
  const t = useTranslations("Dashboard");
  const date = useSelector((state: RootState) => state?.dateFilterSlice?.value);
  const department = useSelector(
    (state: RootState) => state?.departmentSlice?.value
  );
  const userRole = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  )!;
  const [tasks, setTasks] = useState<any[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (department && department.uid) {
      setLoad(true);
      fetchClientTasks(department.uid, date, userRole).then((fetchedTasks) => {
        if (fetchedTasks) {
          setTasks(fetchedTasks);
          setLoad(false);
        }
      });
    }
  }, [date, department, userRole]);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        lg={userRole === "super_admin" ? 7 : 12}
        sx={{
          background: "#fff",
          padding: "10px",
          boxShadow: "1px 4px 5px 0px #eee",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <DatePicker />
        {load && <NiceLoading />}
        {!load && tasks.length > 0 && <WraperOfTasks tasks={tasks} />}
        {!load && tasks.length === 0 && (
          <Box
            sx={{
              padding: "8px",
              background: theme.palette.primary.dark,
              width: "200px",
              borderRadius: "8px",
              color: "#fff",
            }}
          >
            {t("no-tasks")}
          </Box>
        )}
      </Grid>
      {userRole === "super_admin" && (
        <Grid item xs={12} lg={5}>
          <Box
            ml={"10px"}
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px 15px 15px 0px",
            }}
          >
            <Chart start_date={startDate} end_date={endDate} />
            <PieTaskChart start_date={startDate} end_date={endDate} />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
