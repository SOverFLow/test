"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DeleteAmortizationProps {
  amortization_id: string;
  useDialogOpen: [boolean, (value: boolean) => void];
}

export default function DeleteAmortization({
  amortization_id,
  useDialogOpen,
}: DeleteAmortizationProps) {
  const supabase = createClient();
  const [openDialog, setOpenDialog] = useDialogOpen;
  const t = useTranslations("Amortization");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("Amortization")
      .delete()
      .eq("uid", amortization_id);
    if (error) {
      toast.error(t('error-deleting'), {
        position: "bottom-right",
      });
    } else {
      toast.success(t('Amortization-deleted-successfully'), {
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
        DialogTitle={t("Confirm-Delete")}
        DialogContentText={t('Are-you-sure-you-want-to-delete-this-Amortization?')}
      />
    </>
  );
}
