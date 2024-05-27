import React, { useEffect, useMemo, useState } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchTaskData } from "./utils/fetchTaskData";
import { useTranslations } from "next-intl";

export default function PieTaskChart({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) {
  const departmentId = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const [taskData, setTaskData] = useState({
    done: 0,
    inProgress: 0,
    pending: 0,
  });
  const t = useTranslations("Dashboard");

  useEffect(() => {
    departmentId &&
      fetchTaskData(departmentId, start_date, end_date).then((data) => {
        data && setTaskData(data);
      });
  }, [departmentId, start_date, end_date]);

  useEffect(() => {
    const chartDom = document.getElementById("PieTask-chart");
    const myChart = echarts.init(chartDom);

    const option: any = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: [t("In-progress"), t("Pending"), t("Done")],
      },
      series: [
        {
          name: "Tasks",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: "{c} {b}",
            position: "outside",
            emphasis: {
              label: {
                show: true,
                fontSize: 25,
                fontWeight: "bold",
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: taskData.done,
              name: t("Done"),
              itemStyle: { color: "#32CD32" },
              label: {
                show: true,
                formatter: "{c} {b}",
                position: "outside",
              },
            },
            {
              value: taskData.inProgress,
              name: t("In-progress"),
              itemStyle: { color: "#FFD700" },
              label: {
                show: true,
                formatter: "{c} {b}",
                position: "outside",
              },
            },
            {
              value: taskData.pending,
              name: t("Pending"),
              itemStyle: { color: "#FF4500" },
              label: {
                show: true,
                formatter: "{c} {b}",
                position: "outside",
              },
            },
          ],
        },
      ],
    };

    myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, [taskData, t]);

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "10px",
      }}
    >
      <div id="PieTask-chart" style={{ width: "100%", height: "400px"}} />
    </Box>
  );
}
