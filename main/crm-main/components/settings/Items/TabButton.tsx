import { Button, ButtonProps, styled } from "@mui/material";
import { grey, red } from "@mui/material/colors";

type TabButtonProps = ButtonProps & {
  btn_type?: string;
};

export const TabButton = styled(Button)<TabButtonProps>(({ btn_type }) => ({
  borderRadius: "1.2rem",
  fontWeight: 600,
  size: "small",
  textTransform: "none",

  transition: "transform 0.3s ease",

  ...(btn_type === "outlined" && {
    border: "0.125rem solid black",
    borderColor: "#2f2f2f",
    backgroundColor: "white",
    color: "#2f2f2f",
    "&:hover": {
      scale: 3,
      transform: "scale(1.05)",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    },
  }),

  ...(btn_type === "contained" && {
    border: "0.125rem solid black",
    borderColor: "#2f2f2f",
    backgroundColor: "#2f2f2f",
    color: "white",
    "&:hover": {
      scale: 3,
      backgroundColor: grey[900],
      color: "white",
      transform: "scale(1.05)",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    },
  }),

  ...(btn_type === "link" && {
    fontWeight: 500,

    backgroundColor: "transparent",
    color: "#2f2f2f",
    textDecoration: "underline",
    "&:hover": {
      backgroundColor: "transparent",
      scale: 3,
      color: "black",
      transform: "scale(1.05)",
    },
  }),
}));
