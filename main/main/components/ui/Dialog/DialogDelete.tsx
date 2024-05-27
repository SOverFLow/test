import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";

interface DialogDeleteProps {
  label?: any | undefined;
  handleCloseDialog: () => void;
  handleOpenDialog: () => void;
  handleDelete: () => void;
  openDialog: boolean;
  DialogTitle: string;
  DialogContentText: string;
  outlined?: boolean;
}
export function DialogDelete(props: DialogDeleteProps) {
  const t = useTranslations("Stock");
  return (
    <>
      {props.label && (
        <Button
          variant={props.outlined ? "outlined" : "text"}
          color="error"
          onClick={props.handleOpenDialog}
          sx={{
            textTransform: "none",
            minWidth: "30px",
          }}
          title="delete"
        >
          {props.label}
        </Button>
      )}

      <Dialog open={props.openDialog} onClose={props.handleCloseDialog}>
        <DialogTitle>{props.DialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.DialogContentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleCloseDialog}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={props.handleDelete}
            color="error"
            sx={{ color: "#fff", marginRight: "16px", textTransform: "none" }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
