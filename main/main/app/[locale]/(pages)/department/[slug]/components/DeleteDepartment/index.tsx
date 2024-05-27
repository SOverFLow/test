"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import theme from "@/styles/theme";
import { Toast } from "@/components/ui/Toast/Toast";
import { Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";


const StyledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  height: "36px",
  backgroundColor: theme.palette.error.main,
}));

export default function DeleteDepartment({departmentId}: {departmentId : string}) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");
  const router = useRouter();

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("Department")
      .delete()
      .eq("uid", departmentId);
      handleCloseDialog();
      setOpen(true);
    if (error) {
      setMessage("Error deleting Department");
      setBgcolor(theme.palette.error.main);
    }
    else
    {
      router.push("/department");
      setMessage("Department deleted successfully");
      setBgcolor(theme.palette.success.main);
    }

  };
  return (
    <>
    <StyledButton aria-label="delete" onClick={handleOpenDialog}><DeleteIcon /></StyledButton>
    <Toast message={message} backgroundColor={bgcolor} open={open} setOpen={setOpen} />
    <DialogDelete
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle="Confirm Delete"
        DialogContentText="Are you sure you want to delete this Department?"
      />
    </>
  );
}
