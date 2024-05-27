"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import axios from "axios";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";

interface DeleteClient {
  ClientId: number | string;
}

export default function DeleteClient(props: DeleteClient) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const t = useTranslations("client");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const allData = { client_id: props.ClientId};
    try {
      await axios.delete("/api/client", { data: allData });
      handleCloseDialog();
      toast.success(t('client-deleted-successfully'), {
        position: "bottom-right",
      });
    } catch (error) {
      handleCloseDialog();
      toast.error(t('error-deleting-client'), {
        position: "bottom-right",
      });
    }
  };
  return (
    <>
      <DialogDelete
        label={<DeleteIcon />}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle={t('confirm-delete')}
        DialogContentText={t('are-you-sure-you-want-to-delete-this-client')}
      />
    </>
  );
}
