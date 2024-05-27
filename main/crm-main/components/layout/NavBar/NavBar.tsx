"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import {Box} from "@mui/material";
import { styled } from "@mui/material/styles";
import { lazy } from "react";
const SearchInput = lazy(() => import("./components/SearchInput"));
const IconButtons = lazy(() => import("./components/ProfileNav"));
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { toggle } from "@/store/menuSlice";
import Image from "next/image";
import ChangeDepartmentComponent from "./components/ChangeDepartmentComponent";
import LogoSvg from "@/components/ui/Logo";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#fff",
  position: "fixed",
  width: "100dvw",
  height: "64px",
  display: "flex",
  alighItems: "center",
});

const Logo = styled(Box)({
  width: "125px",
  marginRight: "10px",
  marginTop: "6px",
  marginLeft: "30px",
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: "#fff",
  },

  margin: theme.spacing(1),
  borderRadius: "10px",
}));

const NavBar = () => {
  const dispach = useDispatch();
  const handleDrawerToggle = () => {
    dispach(toggle());
  };
  return (
    <StyledAppBar
      position="static"
      sx={{ zIndex: "101", width: "100%", height: "fit-content" }}
    >
      <Toolbar disableGutters>
        <Logo>
          <LogoSvg />
        </Logo>
        <StyledIconButton
          edge="start"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </StyledIconButton>
        <ChangeDepartmentComponent />
        <IconButtons />
      </Toolbar>
    </StyledAppBar>
  );
};
export default NavBar;
