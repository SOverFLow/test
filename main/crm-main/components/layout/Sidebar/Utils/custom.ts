import { CSSObject, Theme } from "@mui/material";

const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  marginTop: "64px",
  width: drawerWidth,
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme, matches: boolean): CSSObject => ({
    marginTop: "64px",
    width: matches ? "60px" : "0px",
    overflowX: "hidden",
    ">.MuiPaper-root": {
      paddingLeft: matches ? theme.spacing(1) : "0px",
      paddingRight: matches ? theme.spacing(1) : "0px",
      overflowY: "auto",
      height: "calc(100vh - 76px)",
    },
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});

export { openedMixin, closedMixin };

