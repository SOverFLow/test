"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddIcon from "@mui/icons-material/Add";
import { Box, Grid } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";

import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { tvaSchema } from "@/utils/schemas/tva/tvaSchema";
import { styled } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useZodNameFamily } from "@/schemas/zod/zod.contract";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

interface props {
  children?: React.ReactNode;
  isOverride?: boolean;
  setFamilyList?: any;
}

export default function CreateFamily({
  children,
  isOverride,
  setFamilyList,
}: props) {
  const supabase = createClient();
  const departmentId = useParams().slug;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const familyZod = useZodNameFamily();
  const t = useTranslations('Service');

  const [newFamily, setNewFamliy] = useState({
    name: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onSubmit = async () => {
    const returnvalue = familyZod.safeParse(newFamily);

    if (returnvalue.success) {
      try {
        const { error } = await supabase.from("ServiceFamily").insert([
          {
            department_id: departmentId as string,
            name: newFamily.name,
          },
        ]);

        if (error) {
          throw error;
        }
        toast.success(t('family-created-successfully')),
          {
            position: "bottom-right",
          };
        setErrors({});
      } catch (error) {
        toast.error(t('error-creating-family')),
          {
            position: "bottom-right",
          };
      }
      setFamilyList((prevState: any) => [
        ...prevState,
        {
          name: newFamily.name,
        },
      ]);
      setNewFamliy({
        name: "",
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
      {isOverride ? (
        <Box onClick={handleOpenDialog}>{children}</Box>
      ) : (
        <Box>
          <CustumButton
            label={
              <>
                <AddIcon />
                {t('create-family')}
              </>
            }
            onClick={handleOpenDialog}
          />
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
            <Grid item xs={12}>
                {t('create-family')}
            </Grid>
          <TextField
            autoFocus
            margin="dense"
            label={t('name')}
            type="text"
            fullWidth
            name="name"
            value={newFamily.name}
            onChange={(event) =>
              setNewFamliy({ ...newFamily, name: event.target.value })
            }
          />
          {errors.name && <FormError error={errors.name} />}
        </DialogContent>
        <DialogActions>
          <CustumButton label={t('cancel')} onClick={handleCloseDialog} />
          <CustumButton label={t('Save')} onClick={onSubmit} />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
