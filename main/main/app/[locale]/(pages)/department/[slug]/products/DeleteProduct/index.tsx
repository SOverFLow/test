"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DeleteProductProps {
  productId: string | string[];
  isMultiple?: boolean;
  lable?: string;
}

export default function DeleteProduct({
  productId,
  isMultiple,
  lable,
}: DeleteProductProps) {
  const t = useTranslations("product");
  const supabase = createClient();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      if (isMultiple && Array.isArray(productId)) {
        console.log("here...  ")
        const { error } = await supabase
          .from("Product")
          .delete()
          .in("uid", productId);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("Product")
          .delete()
          .eq("uid", productId);
        if (error) {
          throw error;
        }
      }
      toast.success("Product deleted successfully", {
        position: "top-right",
      });
      handleCloseDialog();
    } catch (error) {
      console.log("=>: ", productId);
      console.log("Error deleting Product: ", error);
      handleCloseDialog();
      toast.error("Error deleting Product", {
        position: "top-right",
      });
    }
  };
  return (
    <>
      <DialogDelete
        outlined={!!lable}
        label={
          <>
            <DeleteIcon />
            {lable}
          </>
        }
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle={t("confirm-delete")}
        DialogContentText={
          isMultiple
            ? t("are-you-sure-you-want-to-delete-these-products")
            : t("are-you-sure-you-want-to-delete-this-product")
        }
      />
    </>
  );
}
