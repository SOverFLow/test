"use client";

// React/Mui components
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { styled } from "@mui/material";
import { Box } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// Custom components
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { StatusSchema } from "@/utils/schemas/task/StatusSchema";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslations } from "next-intl";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

export default function CreateNewColumn() {
  const t = useTranslations("task");
  const supabase = createClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );

  const [column, setColumn] = useState({
    title: "",
  });

  const handleOpenDialog = () => {
    setColumn({
      title: "",
    });
    setErrors({
      title: "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setColumn((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = StatusSchema.safeParse(column);
    if (returnvalue.success) {
      const allData = { ...column, department_id: department_id as string };
      await supabase.from("TaskColumn").insert(allData);
      setColumn({
        title: "",
      });
      setErrors({
        title: "",
      });
      setDialogOpen(false);
    } else {
      returnvalue.error.issues.reduce((acc: any, issue: any) => {
        acc[issue.path[0]] = issue.message;
        setErrors(acc);
        return acc;
      }, {} as Record<string, string>);
    }
  };
  return (
    <>
      <CustumButton
        label={
          <>
            <AddCircleOutlineIcon />
            {t('new-column')}
          </>
        }
        onClick={handleOpenDialog}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{t('create-new-column')}</DialogTitle>
        <DialogContent sx={{ padding: "1rem", width: { xs: 300, md: 400 } }}>
          <StyledInput
            margin="dense"
            label={t('column-title')}
            type="text"
            fullWidth
            name="title"
            value={column.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <Box
              component={"span"}
              sx={{
                color: "red",
                fontSize: "13px",
                margin: "4px 0px",
                marginLeft: "9px",
              }}
            >
              {errors.title}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "0 1rem 1.5rem 0" }}>
          <Button
            type="button"
            onClick={handleCloseDialog}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {t('add-column')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
