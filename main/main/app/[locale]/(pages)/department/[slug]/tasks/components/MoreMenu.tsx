import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { lazy, Suspense, useState } from "react";
// const EditTask = lazy(() => import("../EditTask"));
import DeleteTask from "../DeleteTask";
import Link from "next/link";
import { NiceLoading } from "./NiceLoading";

export default function MoreMenu({ taskId }: { taskId: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openEditTask, setOpenEditTask] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setOpenDeleteTask(true);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ padding: "0" }} title="more">
        <MoreVertIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link href={`tasks/${taskId}`}>
          <MenuItem onClick={handleClose}>Details</MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      {openEditTask && (
        <Suspense fallback={<NiceLoading />}>
          {/* <EditTask
            useDialogOpen={[openEditTask, setOpenEditTask]}
            taskId={taskId}
          /> */}
        </Suspense>
      )}
      <DeleteTask
        open={openDeleteTask}
        setOpen={setOpenDeleteTask}
        taskId={taskId}
      />
    </>
  );
}
