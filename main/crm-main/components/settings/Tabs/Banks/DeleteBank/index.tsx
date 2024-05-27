"use client";
import React, { useState, useTransition } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { Toast } from "@/components/ui/Toast/Toast";
import theme from "@/styles/theme";
import { Tooltip } from "@mui/material";
import deleteBank from "@/app/api/settings/actions/delete_bank";

interface DeleteBankButtonProps {
  bankId: string;
}

export default function DeleteBank(props: DeleteBankButtonProps) {
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
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(() => {
      deleteBank(props.bankId).then((data) => {
        handleCloseDialog();
        setOpen(true);
        setBgcolor(theme.palette.success.main);
        if (data?.error) {
          setMessage("Error deleting Bank");
        } else {
          setMessage("Bank deleted successfully");
        }
      });
    });
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
        label={
          <Tooltip title="Edit Bank" disableInteractive>
            <DeleteIcon />
          </Tooltip>
        }
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle="Confirm Delete"
        DialogContentText="Are you sure you want to delete this Bank?"
      />
    </>
  );
}
