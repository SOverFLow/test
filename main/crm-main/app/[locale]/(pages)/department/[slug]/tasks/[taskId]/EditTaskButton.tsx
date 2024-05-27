"use client";
import { useState } from "react";
import { Button } from "@mui/material";
// import EditTask from "../EditTask";

export default function EditTaskButton({ taskId }: { taskId: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Button
        sx={{ height: "34px", width: "130px" }}
        onClick={() => setOpenDialog(true)}
      >
        Edit Task
      </Button>
      {/* <EditTask taskId={taskId} useDialogOpen={[openDialog, setOpenDialog]} /> */}
    </>
  );
}
