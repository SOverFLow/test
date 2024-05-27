"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { Toast } from "@/components/ui/Toast/Toast";
import theme from "@/styles/theme";
import { createClient } from "@/utils/supabase/client";

interface DeleteClient {
  SupplierId: number | string;
}

export default function DeleteSupplier(props: DeleteClient) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
      .from('Supplier')
      .delete()
      .eq('uid', props.SupplierId)

      if (error) {
        throw error;
      }
      handleCloseDialog();
      setOpen(true);
      setMessage("Supplier deleted successfully");
      setBgcolor(theme.palette.success.main);
    } catch (error) {
      handleCloseDialog();
      setOpen(true);
      setMessage("Error deleting Supplier");
      setBgcolor(theme.palette.error.main);
    }
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
        label={<DeleteIcon />}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle="Confirm Delete"
        DialogContentText="Are you sure you want to delete this Supplier?"
      />
    </>
  );
}
