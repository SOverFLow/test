import { Box, BoxProps, Container, ContainerProps, Link, LinkProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
    [theme.breakpoints.up("xs")]: {
      margin: 0,
      padding: 0,
    },
    [theme.breakpoints.up("sm")]: {
      margin: "auto",
      padding: "auto",
    },
    display: "flex",
    alignItems: "center",
    width: "100dvw",
    height: "100dvh",
    justifyContent: "center",
  }));
  
const StyledBoxedContainer = styled(Box)<BoxProps>(({ theme }) => ({
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    [theme.breakpoints.up("xs")]: {
      maxHeight: "100%",
      maxWidth: "100%",
      borderRadius: "0px",
    },
    [theme.breakpoints.up("md")]: {
      maxHeight: "80%",
      maxWidth: "95%",
      borderRadius: "20px",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "2000px",
    },
    display: "flex",
  }));
  
const StyledFirstBox = styled(Box)<BoxProps>(({ theme }) => ({
    padding: "20px",
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "background.default",
    [theme.breakpoints.down("md")]: {
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
    [theme.breakpoints.up("md")]: {
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "12px",
    },
  }));
  
const StyledLink = styled(Link)<LinkProps>({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "text.secondary",
    "&:hover": {
      textDecoration: "underline",
    },
  });
  
  const StyledSecondBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: "relative",
    height: "100%",
    width: "100%",
    backgroundImage: `url('/images/hero.webp')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("md")]: {
      borderBottomRightRadius: "0px",
      borderTopRightRadius: "0px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      borderBottomRightRadius: "12px",
      borderTopRightRadius: "12px",
      display: "flex",
    },
    "::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(27, 56, 100, 0.4)",
        borderRadius: "inherit",
    },
}));

const BoxWithLogbg = styled(Box)<BoxProps>(({ theme }) => ({
  height: "100px",
  width: "140%",
  backgroundImage: `url('/images/logo.svg')`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
}));

export {
    StyledContainer,
    StyledBoxedContainer,
    StyledFirstBox,
    StyledLink,
    StyledSecondBox,
    BoxWithLogbg,
  };