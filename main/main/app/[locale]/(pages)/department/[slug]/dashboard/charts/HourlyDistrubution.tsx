"use client";
import getWorkingHours from "@/app/api/task/action/getWorkingHours";
import { RootState } from "@/store";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import HourlyDistributionChart from "./HourlyDistributionChart";

interface props {
  Title: string;
}

const chartsParams = {
  margin: { bottom: 20, left: 25, right: 5 },
  height: 300,
};

const StyledBox = styled(Box)({
  background: "#ffffff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "1px 4px 5px 0px #eee",
});

type WorkerHoursDetail = {
  workerName: string;
  hours: number;
  uid: string;
  avatar: string;
}[];

export default function HourlyDistrubution(props: props) {
  const department_id = useSelector(
    (state: RootState) => state.departmentSlice?.value?.uid
  );
  const theme = useTheme();
  // const [data, setData] = React.useState<any[]>([]);
  // get the period from the url params
  // const period = usePathname().split("/").pop()?.split("-");
  // const [startDate, setStartDate] = React.useState("");
  // const [endDate, setEndDate] = React.useState("");
  // if (period) {
  //   setStartDate(period[0]);
  //   setEndDate(period[1]);
  // }

  const [workerHoursDetail, setWorkerHoursDetail] = React.useState<WorkerHoursDetail>([]);

  React.useEffect(() => {
    getWorkingHours(department_id)
      .then((data) => {
        setWorkerHoursDetail(data ? data : []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [department_id]);


  return (
    <StyledBox display={"flex"} justifyItems={"center"} sx={{ width: "100%" }}>
      <HourlyDistributionChart data={workerHoursDetail} />
    </StyledBox>
  );
}
