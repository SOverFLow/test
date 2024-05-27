"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { Toast } from "@/components/ui/Toast/Toast";
import theme from "@/styles/theme";

interface DeleteTaskButtonProps {
  taskId: number | string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteTask(props: DeleteTaskButtonProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");

  const { open: openDialog, setOpen: setOpenDialog } = props;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("Task")
      .delete()
      .eq("uid", props.taskId);
    if (error) {
      setMessage("Error deleting task");
      setBgcolor(theme.palette.error.main);
      setOpen(true);
    } else {
      setMessage("Task deleted successfully");
      setBgcolor(theme.palette.success.main);
      setOpen(true);
    }

    handleCloseDialog();
  };
  return (
    <>
      <Toast
        message={message}
        backgroundColor={bgcolor}
        open={open}
        setOpen={setOpen}
      />
      <DialogDelete
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle="Confirm Delete"
        DialogContentText="Are you sure you want to delete this task?"
      />
    </>
  );
}
