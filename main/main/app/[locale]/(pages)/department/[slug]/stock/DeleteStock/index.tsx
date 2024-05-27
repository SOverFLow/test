"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DeleteStockButtonProps {
  stockId: number | string;
}

export default function DeleteStock(props: DeleteStockButtonProps) {
  const t = useTranslations("Stock");

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const allData = { stock_id: props.stockId };
    try {
      await axios.delete("/api/Stock", { data: allData });
      handleCloseDialog();
      toast.success(t("stock-deleted-successfully"), {
        position: "bottom-right",
      });
    } catch (error) {
      handleCloseDialog();
      toast.error(t("error-deleting-stock"), {
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
        DialogContentText={t("are-you-sure-you-want-to-delete-this-stock")}
      />
    </>
  );
}
