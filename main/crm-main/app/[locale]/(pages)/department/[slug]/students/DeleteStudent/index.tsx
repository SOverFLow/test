"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import axios from "axios";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";

interface DeleteStudent {
  StudentId: number | string | string[];
  isMultiple?: boolean;
  lable?: string;
}

export default function DeleteStudent(props: DeleteStudent) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const supabase = createClient();
  const t = useTranslations("student");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const allData = { student_id: props.StudentId};
    try {
      // if (props.isMultiple && Array.isArray(props.StudentId)) {
      //   console.log("here...  ")
      //   const { error } = await supabase
      //     .from("Student")
      //     .delete()
      //     .in("uid", props.StudentId);
      //   if (error) {
      //     throw error;
      //   }
      // } else {
      await axios.delete("/api/student", { data: allData });
      handleCloseDialog();
      // }
      toast.success(t('student-deleted-successfully'), {
        position: "bottom-right",
      });

    } catch (error) {
      handleCloseDialog();
      toast.error(t('error-deleting-student'), {
        position: "bottom-right",
      });
    }
  };
  return (
    <>
      <DialogDelete
      outlined={!!props.lable}
      label={
        <>
          <DeleteIcon />
          {props.lable}
        </>
      }
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleDelete={handleDelete}
        handleOpenDialog={handleOpenDialog}
        DialogTitle={t('confirm-delete')}
        DialogContentText={t('are-you-sure-you-want-to-delete-this-student')}
      />
    </>
  );
}
