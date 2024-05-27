"use client";
import React, { useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditIcon from "@mui/icons-material/Edit";
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

import { useDepartSchema } from "@/utils/schemas//department/departmentSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getDepartmentData } from "./FunctionUtils";
import { useTranslations } from "next-intl";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  height: "36px",
}));

export default function EditDepartment({ departmentId }: { departmentId: string }) {
  const supabase = createClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations("UpdateDepartmentForm");
  const departmentSchema = useDepartSchema();
  const userId = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.id
  );
  const [newDepartment, setDepartment] = useState<any>({
    title: "",
    description: "",
  });

  const tranlateObj = {
    Formtitle: t("Formtitle"),
    title: t("title"),
    description: t("description"),
    add_button: t("add_button"),
    cancel_button: t("cancel_button"),
  };
  const memoizedTaskData = useMemo(() => {
    if (departmentId) {
      getDepartmentData(departmentId)
        .then((data) => setDepartment(data))
        .catch((error) => console.error(error));
    }
  }, [departmentId]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDepartment((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = departmentSchema.safeParse(newDepartment);
    if (returnvalue.success) {
      const allData = { ...newDepartment, super_admin_id: userId as string };
      const { data, error } = await supabase
        .from("Department")
        .update(allData)
        .eq("uid", departmentId)
        .select("*");
      setDepartment({
        title: "",
        description: "",
      });
      setErrors({
        title: "",
        description: "",
      });
      setDialogOpen(false);
    } else {
       returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };
  return (
    <Box>
      <StyledButton aria-label="edit" onClick={handleOpenDialog}>{t('edit-department')}</StyledButton>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{tranlateObj.Formtitle}</DialogTitle>
        <DialogContent>
        <Grid
            container
            sx={{ width: "30rem", height: "12rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
          <StyledInput
            margin="dense"
            label={tranlateObj.title}
            type="text"
            fullWidth
            name="title"
            value={newDepartment.title}
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

          <StyledInput
            margin="dense"
            label={tranlateObj.description}
            type="text"
            fullWidth
            name="description"
            value={newDepartment.description}
            onChange={handleInputChange}
            rows={3}
            multiline
            InputLabelProps={{  required:false}}

          />
          {errors.description && (
            <Box
              component={"span"}
              sx={{
                color: "red",
                fontSize: "13px",
                margin: "4px 0px",
                marginLeft: "9px",
              }}
            >
              {errors.description}
            </Box>
          )}
          </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={handleCloseDialog}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {tranlateObj.cancel_button}
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            sx={{ color: "#fff", marginRight: "16px", textTransform: "none" }}
          >
            {tranlateObj.add_button}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
