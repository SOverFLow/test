"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import { useDepartSchema } from "@/utils/schemas/department/departmentSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface props {
  tranlateObj: any;
}

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

export default function CreateDepartment(props: props) {
  const supabase = createClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations("navbardeper");
  const departmentSchema = useDepartSchema();
  const userId = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.id
  );
  const [newDepartment, setDepartment] = useState({
    title: "",
    description: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    if (props.tranlateObj.fromMenu === 1) props.tranlateObj.setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (props.tranlateObj.fromMenu === 1)
      props.tranlateObj.setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDepartment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    if (props.tranlateObj.fromMenu === 1) {
      setDialogOpen(() => props.tranlateObj.dialogOpen);
    }
  }, [props.tranlateObj.dialogOpen, props.tranlateObj.fromMenu]);

  const onSubmit = async () => {
    const returnvalue = departmentSchema.safeParse(newDepartment);
    if (returnvalue.success) {
      const allData = { ...newDepartment, super_admin_id: userId as string };
      const { data, error } = await supabase
        .from("Department")
        .insert(allData)
        .select("*");
      if (error) {
        toast.error(t('department-creation-failed'), {
          position: "bottom-right",
        });
        console.error("errorff", error);
      }
      else
      {
        toast.success(t('department-created-successfully'), {
          position: "bottom-right",
        });
      }
      setDepartment({
        title: "",
        description: "",
      });
      setErrors({
        title: "",
        description: "",
      });
      setDialogOpen(false);
      if (props.tranlateObj.fromMenu === 1)
        props.tranlateObj.setDialogOpen(false);
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
    <Grid container spacing={2} sx={{marginRight:'0px',marginLeft:'0px'}}>
        {!props.tranlateObj.fromMenu && (
          <>
          <CustumButton label={<><AddIcon />{t('create-new-department')}</>} onClick={handleOpenDialog} />
        </>
        )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{props.tranlateObj.Formtitle}</DialogTitle>
        <DialogContent>
        <Grid
            container
            sx={{ width: "30rem", height: "12rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
          <StyledInput
            margin="dense"
            label={props.tranlateObj.title}
            type="text"
            fullWidth
            name="title"
            value={newDepartment.title}
            onChange={handleInputChange}
          />

          {errors.title && (<FormError error={errors.title} />)}

          <StyledInput
            margin="dense"
            label={props.tranlateObj.description}
            type="text"
            fullWidth
            name="description"
            value={newDepartment.description}
            onChange={handleInputChange}
            InputLabelProps={{  required:false}}
            rows={3}
            multiline
          />
          {errors.description && (<FormError error={errors.description} />)}
          </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CustumButton label={props.tranlateObj.cancel_button} onClick={handleCloseDialog}/>
          <Button
            type="submit"
            onClick={onSubmit}
            sx={{ color: "#fff", marginRight: "16px", textTransform: "none" }}
          >
            {props.tranlateObj.add_button}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
