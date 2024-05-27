"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Grid, TextField, styled } from "@mui/material";
import dynamic from "next/dynamic";

// Dnd-kit
import {
  Active,
  ClientRect,
  Collision,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  closestCenter,
  pointerWithin,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DroppableContainer, RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/core/dist/types";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { open, close } from "@/store/loadingSlice";

// Custom components
import { Column, Id, Task } from "../utils/types";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import fetchClientTasks, { updateTaskColumn } from "../utils/fetchClientTasks";
import { createClient } from "@/utils/supabase/client";
import { realtimeColumnChanged } from "./handleRealtimeEvents";
import { payloadToTask } from "../utils/taskFormater";

const StyledColumnList = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 296px)",
  display: "flex",
  gap: "1rem",
  overflowX: "auto",
  paddingBottom: ".5rem",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const supabase = createClient();

function TasksBoard({ tasksData, columnsData }: { tasksData: Task[], columnsData: Column[]}) {
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const dateFilter = useSelector(
    (state: RootState) => state?.dateFilterSlice?.value
  );
  const userRole = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  )!;
  const [columns, setColumns] = useState<Column[]>(columnsData);
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const columnsId = useMemo(() => columns.map((col) => col.uid), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);
  const [disableDnD, setDisableDnD] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    window.innerWidth < 768 && setDisableDnD(true);
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setDisableDnD(true);
      } else {
        setDisableDnD(false);
      }
    });
    return () => window.removeEventListener("resize", () => {});
  }, [setDisableDnD]);

  const id = useId();

  useEffect(() => {
    const today = new Date();
    if (dateFilter.toString() === today.toString()) {
      setTasks(tasksData);
    } else {
      if (department_id) {
        fetchClientTasks(department_id, dateFilter, userRole).then(
          (fetchedTasks) => {
            if (fetchedTasks) {
              setTasks(fetchedTasks);
            }
          }
        );
      }
    }
  }, [dateFilter, tasksData, department_id, userRole, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    supabase
      .channel("realtime:column")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "TaskColumn" },
        (payload) => {
          setColumns((prevColumns) =>
            realtimeColumnChanged(payload, prevColumns)
          );
        }
      )
      .subscribe();

    supabase
      .channel("realtime:task")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Task" },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.uid !== payload.old.uid)
            );
          } else if (payload.eventType === "INSERT") {
            const newTask = await payloadToTask(
              payload.new,
              supabase,
              userRole
            );
            newTask && setTasks((prevTasks) => [newTask, ...prevTasks]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prevTasks) =>
              prevTasks.map((task) => {
                const { column_id, ...restOfTask } = task;
                return task.uid === payload.new.uid
                  ? { column_id: payload.new.column_id, ...restOfTask }
                  : task;
              })
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.channel("realtime:column").unsubscribe();
      supabase.channel("realtime:task").unsubscribe();
    };
  }, [userRole]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
      <DndContext
        id={id}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={collisionDetectionAlgorithm}
      >
        <Box>
          <StyledColumnList>
            <SortableContext items={columnsId}>
              <ColumnContainer
                disableDnD={disableDnD}
                column={{ uid: "0", title: "Tasks of the day" }}
                tasks={tasks.filter((task) => !task.column_id)}
              />
              {columns.map((col) => (
                <ColumnContainer
                  disableDnD={disableDnD}
                  key={col.uid}
                  column={col}
                  tasks={tasks.filter((task) => task.column_id === col.uid)}
                />
              ))}
            </SortableContext>
          </StyledColumnList>
        </Box>

        {mounted &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  disableDnD={disableDnD}
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.column_id === activeColumn.uid
                  )}
                />
              )}
              {activeTask && (
                <TaskCard disableDnD={disableDnD} task={activeTask} />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    if (activeTask) {
      const res = updateTaskColumn(
        activeTask.uid,
        activeTask.column_id === "0" ? null : activeTask.column_id
      );
      if (!res) return;
    }
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex(
          (col) => col.uid === active.id
        );
        const overColumnIndex = prevColumns.findIndex(
          (col) => col.uid === over.id
        );

        if (activeColumnIndex === overColumnIndex) return prevColumns; // No change needed
        return arrayMove(prevColumns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.uid === activeId);
        const overIndex = tasks.findIndex((t) => t.uid === overId);

        if (tasks[activeIndex].column_id != tasks[overIndex].column_id) {
          // Fix introduced after video recording
          tasks[activeIndex].column_id = tasks[overIndex].column_id;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.uid === activeId);

        tasks[activeIndex].column_id = String(overId);
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export function collisionDetectionAlgorithm(args: {
  active: Active;
  collisionRect: ClientRect;
  droppableRects: RectMap;
  droppableContainers: DroppableContainer[];
  pointerCoordinates: Coordinates | null;
}): Collision[] {
  const closestCornersCollisions = closestCorners(args);
  const closestCenterCollisions = closestCenter(args);
  const pointerWithinCollisions = pointerWithin(args);

  if (
    closestCornersCollisions.length > 0 &&
    closestCenterCollisions.length > 0 &&
    pointerWithinCollisions.length > 0
  ) {
    return pointerWithinCollisions;
  }
  return null as any;
}

export default TasksBoard;
