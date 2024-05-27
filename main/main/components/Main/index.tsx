"use client";
import { RootState } from "@/store";
import { styled } from "@mui/material";
import { useSelector } from "react-redux";

const StyledMain = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  position: "relative",
  marginTop: "76px",
  flexGrow: 1,
  zIndex: 100,
  [theme.breakpoints.up("xs")]: {
    width: open ? "calc(100vw - 240px)" : "calc(100vw - 60px)",
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
    padding: theme.spacing(1),
  },
  width: open ? "calc(100vw - 240px)" : "calc(100vw - 60px)",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = ({ children }: { children: React.ReactNode }) => {
  const open = useSelector((state: RootState) => state?.menuSlice?.value);
  return <StyledMain id="styled-main" open={open}>{children}</StyledMain>;
};

export default Main;
