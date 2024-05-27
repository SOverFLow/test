import { Box } from "@mui/material";
import TaskOfDay from "./TaskOfDay";

type Task = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  avatarUrl: string[];
  worker_id: string[];
  worker_name: string[];
};

type WrapperProps = {
  tasks: Task[];
};

export default function WraperOfTasks({ tasks }: WrapperProps) {
  return (
    <Box
      sx={{
        height: "500px",
        maxHeight: "100%",
        overflowY: "auto",
        width: "100%",
        overflowX: "hidden",
        padding: "8px 20px",
        textAlign: "center",
      }}
    >
      {tasks.map((task) => (
        <TaskOfDay
          key={task.id}
          id={task.id}
          title={task.title}
          startTime={task.startTime}
          endTime={task.endTime}
          status={task.status}
          avatarUrl={task.avatarUrl}
          worker_id={task.worker_id}
          worker_name={task.worker_name}
        />
      ))}
    </Box>
  );
}
