import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar } from "@mui/material";

export interface ToastProps {
  message: string;
  backgroundColor: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function Toast({ message, backgroundColor, open, setOpen }: ToastProps) {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        marginTop: "80px",
        "& .MuiPaper-root": {
          backgroundColor: backgroundColor,
        },
      }}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      message={message}
      action={action}
    />
  );
}
