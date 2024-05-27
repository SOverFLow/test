"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";

interface DeleteContactProps {
  contact_id: string;
  useDialogOpen: [boolean, (value: boolean) => void];
}

export default function DeleteContact({
  contact_id,
  useDialogOpen,
}: DeleteContactProps) {
  const supabase = createClient();
  const [openDialog, setOpenDialog] = useDialogOpen;
  const t = useTranslations("Contact");


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("Contact")
      .delete()
      .eq("uid", contact_id);
    if (error) {
      toast.error(t('error-deleting'), {
        position: "bottom-right",
      });
    } else {
      toast.success(t('Contact-deleted-successfully'), {
        position: "bottom-right",
      });
    }

    handleCloseDialog();
  };
  return (
    <>
      <DialogDelete
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle={t('Confirm-Delete')}
        DialogContentText={t('Are-you-sure-you-want-to-delete-this-contact?')}
      />
    </>
  );
}
