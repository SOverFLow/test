import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { Column, Task } from "../utils/types";
const DateFilter = dynamic(() => import("./DateFilter"), { ssr: false });
const TasksBoard = dynamic(() => import("./TasksBoard"), { ssr: false });

export default function Board({
  tasksData,
  columnsData,
}: {
  tasksData: Task[];
  columnsData: Column[];
}) {
  return (
    <Box height={"100%"}>
      <DateFilter />
      <TasksBoard tasksData={tasksData} columnsData={columnsData} />
    </Box>
  );
}