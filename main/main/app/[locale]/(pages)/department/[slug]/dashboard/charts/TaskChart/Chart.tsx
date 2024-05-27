"use client";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import { tasksCounter } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ChartTask {
  name: string;
  confirmed: number;
  notConfirmed: number;
}

export default function Chart({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) {
  const [filter, setFilter] = useState<"Month" | "Week" | "Year" | "none">(
    "none"
  );
  const departmentId = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const [tasks, setTasks] = useState<ChartTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    departmentId &&
      tasksCounter(departmentId, start_date, end_date, filter).then((data) => {
        setLoading(false);
        data && setTasks(data);
      });
  }, [departmentId, start_date, end_date, filter]);

  const handleChange = (event: any) => {
    setFilter(event.target.value as "Month" | "Week" | "Year" | "none");
  };

  return (
    <Box width="100%" height="400px" mb={"50px"} position={"relative"}>
      <Box
        display={loading ? "block" : "none"}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={"15px"}>
        <Typography variant="h6" marginLeft={"20px"}>
          Tasks Chart:
        </Typography>
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant="body1" mr={"10px"}>
            Filter by:
          </Typography>
          <Select
            value={filter}
            onChange={handleChange}
            sx={{ height: "30px" }}
          >
            <MenuItem value={"none"}>none</MenuItem>
            <MenuItem value={"Week"}>Week</MenuItem>
            <MenuItem value={"Month"}>Month</MenuItem>
            <MenuItem value={"Year"}>Year</MenuItem>
          </Select>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={600}
          height={400}
          data={tasks}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            name={"Confirmed"}
            dataKey="confirmed"
            fill="#91CC75"
            activeBar={<Rectangle fill="#91CC75" stroke="black" />}
          />
          <Bar
            name={"Not Confirmed"}
            dataKey="notConfirmed"
            fill="#EE6666"
            activeBar={<Rectangle fill="#EE6666" stroke="black" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
