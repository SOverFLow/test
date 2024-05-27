"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";


interface DeleteTvaProps {
  tvaId: number | string;
}

export default function DeleteTva(props: DeleteTvaProps) {
  const supabase = createClient();
  const [openDialog, setOpenDialog] = React.useState(false);
  const t = useTranslations("tva");


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("TVA")
      .delete()
      .eq("uid", props.tvaId);

      handleCloseDialog();
    if (error) {
      toast.error(t('error-deleting-tva'), {
        position: "bottom-right",
      });
    }
    else
    {
      toast.success(t('tva-deleted-successfully'), {
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
        DialogContentText={t('are-you-sure-you-want-to-delete-this-tva')}
      />
    </>
  );
}
