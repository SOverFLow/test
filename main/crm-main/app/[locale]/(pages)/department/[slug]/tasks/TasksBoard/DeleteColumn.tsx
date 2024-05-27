"use client";
import { createClient } from "@/utils/supabase/client";
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogTitle,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useState } from "react";

export default function DeleteColumn({
  title,
  uid,
}: {
  title: string;
  uid: string;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteColumn() {
    const supabase = await createClient();
    const { error } = await supabase
      .from("TaskColumn")
      .delete()
      .match({ uid: uid });
    console.log("error: ", error);
    handleClose();
  }
  if (uid === "0") return null;

  return (
    <>
      <IconButton onClick={handleOpen}>
        <DeleteSweepIcon fontSize="large" color="error" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Are you sure you want to delete this Column?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting &quot;{title}&quot; Column will unassign all tasks from it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={deleteColumn}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
