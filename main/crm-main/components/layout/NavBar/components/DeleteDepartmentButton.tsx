"use client";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "@/styles/theme";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usePasswordCheck } from "@/utils/schemas/department/zod.passwordCheck";
import checkIfPasswordIsCorrect, { deleteDepartment } from "./checkIfPasswordIsCorrect";

export default function DeleteDepartmentButton({
  departmentId,
}: {
  departmentId: string;
}) {
  const supabase = createClient();
  const [openDialog, setOpenDialog] = useState(false);
  const t = useTranslations();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransiton] = useTransition();
  const passwordCheck = usePasswordCheck();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const returnvalue = passwordCheck.safeParse({ password: password });
    if (returnvalue.success) {
      startTransiton(async () => {
      const checkIfCorrect = await checkIfPasswordIsCorrect(password);
      if (!checkIfCorrect) {
        toast.error(t('navbardeper.password-is-incorrect-please-re-enter-correct-password'), {
          position: "bottom-right",
        });
      } else {
      const error = await deleteDepartment(departmentId);
      setPassword("");
      handleCloseDialog();
      if (error) {
        console.log("error:", error);
        toast.error(`${t("navbardeper.error-deleting-department")}`, {
          position: "bottom-right",
        });
      } else {
        toast.success(`${t("navbardeper.department-deleted-successfully")}`, {
          position: "bottom-right",
        });
      }
    }
    });
    } else {
      setPasswordError(true);
      return;
    }
  };
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    console.info("You clicked the delete icon.");
  };

  return (
    <Grid item xs={1} onClick={handleClick}>
      <Button
        variant="text"
        aria-label="delete"
        onClick={handleOpenDialog}
        sx={{ minWidth: "40px" }}
      >
        <DeleteIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t("navbardeper.confirm-delete")}</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <DialogContentText>
                {t(
                  "navbardeper.are-you-sure-you-want-to-delete-this-department"
                )}
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("Stock.password")}
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordError}
                helperText={passwordError && t("Stock.password-required")}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} display={'flex'} justifyContent={'center'}>
              <CircularProgress sx={{ display: isPending ? "block" : "none" }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "#fff", textTransform: "none" }}
            disabled={isPending}
          >
            {t("Stock.cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            sx={{ color: "#fff", marginRight: "16px", textTransform: "none" }}
            disabled={isPending}
          >
            {t("Stock.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
