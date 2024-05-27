"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function DeleteBien({ bienId }: { bienId: string }) {
  const supabase = createClient();
  const t = useTranslations("Biens");

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("Bien").delete().eq("uid", bienId);

      if (error) {
        throw error;
      }
      handleCloseDialog();
      toast.success(t("bien-deleted-successfully"), {
        position: "bottom-right",
      });
    } catch (error) {
      handleCloseDialog();
      toast.error(t("Berror-deleting-bien"), {
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
        DialogTitle={t("confirm-delete")}
        DialogContentText={t("are-you-sure-you-want-to-delete-this-bien")}
      />
    </>
  );
}
