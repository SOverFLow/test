import { Id, Task } from "../../utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  AvatarGroup,
  Box,
  Paper,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

// Mui Icons
import TaskTimeline from "@/components/ui/TaskTimeline";
import StyledChip from "@/components/ui/StyledChip";
import MoreMenu from "../../components/MoreMenu";
import TaskStatus from "../../components/TaskStatus";

interface Props {
  task: Task;
  disableDnD: boolean;
}

const cardHeight = "160px";

interface CardProps {
  priority: string | null;
}

const StyledAvatarGroup = styled(AvatarGroup)({
  "& .css-17o22dy-MuiAvatar-root": {
    width: "32px",
    height: "32px",
  },
});

const Card = styled(Paper)<CardProps>(({ theme, priority }) => ({
  padding: "1rem",
  borderRadius: ".4rem",
  borderLeft: "6px solid",
  borderColor:
    priority === "low"
      ? theme.palette.success.main
      : priority === "medium"
        ? theme.palette.warning.main
        : theme.palette.error.main,
  display: "flex",
  flexDirection: "column",
  cursor: "grab",
}));

function TaskCard({ task, disableDnD }: Props) {
  const defaultTheme = useTheme();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.uid,
    disabled: disableDnD,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        priority={task.priority}
        ref={setNodeRef}
        style={style}
        sx={{
          opacity: 0.2,
          border: "3.5px solid",
          borderColor: defaultTheme.palette.primary.main,
          backgroundColor: defaultTheme.palette.primary.light,
          cursor: "grabbing",
          height: cardHeight,
        }}
      ></Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      priority={task.priority}
      onClick={() => console.log("clicked")}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography
          color={"text.primary"}
          fontWeight={"bold"}
          fontSize={"1rem"}
        >
          {task.title}
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={0.7}>
          <StyledChip
            label={`${task.cost}$`}
            variant="filled"
            customcolor={defaultTheme.palette.success}
            size={"small"}
          />
          <MoreMenu taskId={task.uid} />
        </Box>
      </Box>
      <Box mt={".8rem"} display={"flex"} flexDirection={"column"} gap={".6rem"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} gap={0.5} flexDirection={"column"}>
            {task.Workers ? (
              task.Workers.length === 1 && task.Workers[0] ? (
                <Box
                  key={task.Workers[0].uid}
                  display={"flex"}
                  alignItems={"center"}
                  gap={".5rem"}
                >
                  <Avatar
                    alt={task.Workers[0].first_name}
                    src={task.Workers[0].avatar || ""}
                    sx={{ width: "30px", height: "30px" }}
                  />
                  <Typography
                    fontSize={".86rem"}
                    fontWeight={"Bold"}
                    color={"text.secondary"}
                  >
                    {`${task.Workers[0].first_name} ${task.Workers[0].last_name}`}
                  </Typography>
                </Box>
              ) : (
                <StyledAvatarGroup max={3}>
                  {task.Workers.map((worker) => {
                    if (!worker) return;
                    return (
                      <Tooltip
                        key={worker.uid}
                        disableInteractive
                        title={`${worker.first_name} ${worker.last_name}`}
                        placement="right"
                      >
                        <Avatar
                          alt={worker.first_name}
                          src={worker.avatar || ""}
                          sizes="small"
                        />
                      </Tooltip>
                    );
                  })}
                </StyledAvatarGroup>
              )
            ) : (
              <Typography fontSize={"small"} color={"gray"}>
                no workers assigned to this task.
              </Typography>
            )}
          </Box>
          <TaskStatus taskId={task.uid} initialStatus={task.status} />
        </Box>
        <TaskTimeline start_date={task.start_date} end_date={task.end_date} />
      </Box>
    </Card>
  );
}

export default TaskCard;
