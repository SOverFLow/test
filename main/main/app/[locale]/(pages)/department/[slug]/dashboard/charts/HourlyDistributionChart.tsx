import {
  Box,
  Paper,
  Typography,
  useTheme
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HourlyDistributionChart = ({ data }: any) => {
  const theme = useTheme();
  return (
    <Paper sx={{ flexGrow: 1, padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Typography
          style={{ color: theme.palette.text.secondary }}
          gutterBottom
        >
          Hourly Distribution of Tasks per Worker
        </Typography>
      </Box>
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="workerName" />
            <YAxis domain={[0, 40]} />
            <Tooltip animationEasing="linear" />
            <Legend
              style={{
                animation: "fadeIn 1s",
                animationFillMode: "forwards",
                animationTimingFunction: "ease-in-out",
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            />
            <Bar
              style={{
                animation: "fadeIn 1s",
                animationFillMode: "forwards",
                animationTimingFunction: "ease-in-out",
                backgroundColor: "#fff",
                borderRadius: "5px",
                // boxShadow: "0 2px 5px 0 #fff",
              }}
              dataKey="hours"
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default HourlyDistributionChart;
