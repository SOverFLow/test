import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { grey } from "@mui/material/colors";

export default function BasicModal(props: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const isPhone = useMediaQuery("(max-width: 38rem)");

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          borderRadius: 2,
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
          width: isPhone ? "90%" : "fit-content",
          bgcolor: "background.paper",
          border: "2px solid #f2f2f2",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          disableRipple
          onClick={props.onClose}
          sx={{
            px: 2,
            mt: 2,
            py: 0,
            mb: 0,
            color: grey[700],
            display: "flex",
            cursor: "pointer",
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          <CloseRoundedIcon
            sx={{
              "&:hover": {
                color: "black",
              },
            }}
          />
        </Button>
        {props.children}
      </Box>
    </Modal>
  );
}
