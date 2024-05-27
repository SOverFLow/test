"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";

interface DeleteWorkerButtonProps {
  worekerId: number | string;
}

export default function DeleteWorker(props: DeleteWorkerButtonProps) {
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const t = useTranslations("worker");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const allData = { worker_id: props.worekerId };
    try {
      await axios.delete("/api/worker", { data: allData });
      handleCloseDialog();
      toast.success(t('worker-deleted-successfully'), {
        position: "bottom-right",
      });
    } catch (error) {
      handleCloseDialog();
      toast.error(t('error-deleting-worker'), {
        position: "bottom-right",
      });
    }
  };
  return (
    <>
        <DialogDelete
          label={<Tooltip title={t('edit-worker')} disableInteractive><DeleteIcon /></Tooltip>}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          handleDelete={handleDelete}
          handleOpenDialog={handleOpenDialog}
          DialogTitle={t('confirm-delete')}
          DialogContentText={t('are-you-sure-you-want-to-delete-this-worker')}
        />

    </>
  );
}
