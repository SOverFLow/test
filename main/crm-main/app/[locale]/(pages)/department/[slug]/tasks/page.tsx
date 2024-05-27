import { Box, CircularProgress } from "@mui/material";
import TasksTable from "./TasksTable";
import ClientWrapper from "./ClientWrapper";
import fetchServerTasks, {
  fetchServerTasksByDate,
} from "./utils/fetchServerTasks";
import TasksBoard from "./TasksBoard";
import fetchServerColumns from "./utils/fetchServerColumns";

export default async function Tasks({ params }: { params: { slug: string } }) {
  const tasksData = await fetchServerTasks(params.slug);
  const tasksBoardData = await fetchServerTasksByDate(params.slug, new Date());
  const columnsData = await fetchServerColumns(params.slug);
  return (
    <Box>
      <ClientWrapper>
        <TasksBoard tasksData={tasksBoardData || []} columnsData={columnsData || []} />
        <TasksTable initialTasksData={tasksData || []} />
      </ClientWrapper>
    </Box>
  );
}
