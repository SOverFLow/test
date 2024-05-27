import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Task } from "../utils/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import {
  Box,
  Button,
  Fab,
  IconButton,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import StyledChip from "@/components/ui/StyledChip";
import TaskCard from "./TaskCard";
import DeleteColumn from "./DeleteColumn";

const StyledColumn = styled(Paper)(({ theme }) => ({
  // position: "relative",
  height: "100%",
  minWidth: "350px",
  maxWidth: "450px",
  backgroundColor: "#dddddd",
  // borderRadius: ".6rem",
  // [theme.breakpoints.down('sm')]: {
  //   maxHeight: "700px",
  // },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  height: "58px",
  borderRadius: ".6rem .6rem 0 0",
  padding: "0 1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "grab",
  backgroundColor: theme.palette.primary.dark,
  zIndex: 2,
}));

const StyledTaskList = styled(Box)(({ theme }) => ({
  overflow: "auto",
  height: "calc(100% - 58px)",
  padding: "1rem .5rem",
}));

interface Props {
  column: Column;
  tasks: Task[];
  disableDnD: boolean;
}
function ColumnContainer({ column, tasks, disableDnD }: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.uid);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.uid,
    disabled: disableDnD,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          minWidth: "350px",
          maxWidth: "450px",
          border: "3.5px solid",
          borderColor: "primary.main",
          backgroundColor: "primary.light",
          borderRadius: ".6rem",
          opacity: 0.2,
        }}
      ></Box>
    );
  }

  return (
    <StyledColumn ref={setNodeRef} style={style}>
      <StyledHeader {...attributes} {...listeners} color={"#fff"}>
        <Typography variant="h1" zIndex={2} fontSize={"1.3rem"}>
          {column.title}
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"4px"}>
          <StyledChip
            size="small"
            label={tasks.length <= 9 ? String(tasks.length) : "9+"}
          />
          <DeleteColumn uid={column.uid} title={column.title} />
        </Box>
      </StyledHeader>
      <StyledTaskList>
        <Box display={"flex"} flexDirection={"column"} gap={"1rem"}>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard disableDnD={disableDnD} key={task.uid} task={task} />
            ))}
          </SortableContext>
        </Box>
      </StyledTaskList>
    </StyledColumn>
  );
}

export default ColumnContainer;
