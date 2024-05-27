"use client";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { close } from "@/store/menuSlice";

// MUI Components
import {
  Divider,
  List,
  Drawer,
  Typography,
  Box,
  ListItem,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// React/Next Components

// My Components
import SideBarItem from "./SideBarItem";
import { closedMixin, openedMixin } from "./Utils/custom";
import { useEffect, useState } from "react";
import getPermittedItems from "./Utils/getPermittedItems";
import { setOpen } from "@/store/menuSlice";
import { getIfDepartmentIsFormation } from "./Utils/actions";

// Constants
const drawerWidth = 240;

const StyledDrawer = styled(Drawer)<{ open: boolean; matches: number }>(
  ({ theme, open, matches }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme, drawerWidth),
      "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
    }),
    ...(!open && {
      ...closedMixin(theme, !!matches),
      "& .MuiDrawer-paper": closedMixin(theme, !!matches),
      "& .MuiButtonBase-root": {
        padding: "5px",
      },
    }),
    "& .MuiPaper-root": {
      ...(open || matches
        ? { paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }
        : { paddingLeft: "0px", paddingRight: "0px" }),
      overflowY: "auto",
      height: "calc(100vh - 76px)",
    },
  })
);

interface Props {
  data: {
    title: string;
    items: {
      title: string;
      icon: React.ReactNode;
      href: string;
      tableName: string | null;
    }[];
  }[];
}

export default function ClientSideBar({ data }: Props) {
  const open = useSelector((state: RootState) => state?.menuSlice?.value);
  const [isFormation, setIsFormation] = useState(false);
   
  const matches = useMediaQuery("(min-width:600px)");
  const department = useSelector(
    (state: RootState) => state?.departmentSlice?.value
  );
  const [permitedItems, setPermitedItems] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    department &&
      getPermittedItems(department?.uid).then(({ data, error }) => {
        data && setPermitedItems(data);
      });
  }, [department]);

  useEffect(() => {
    getIfDepartmentIsFormation(department?.uid).then((data) => {
      data && setIsFormation(data);
    });
  }, [department]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("menuState");
      dispatch(setOpen(storedValue ? JSON.parse(storedValue) : true));
    }
  }, [dispatch]);

  return (
    <StyledDrawer
      hidden={!department?.uid}
      variant="permanent"
      open={open}
      matches={matches ? 1 : 0}
    >
      <Divider />
      {data.map((group, index) => (
        <Box key={index}>
          {open && <Typography mt={2}>{group.title}</Typography>}
          <List>
            {group.items.map((props, i2) => {
              if (props.tableName === "Student" && !isFormation) return;
              return (
                (!props.tableName ||
                  permitedItems.includes(props.tableName)) && (
                  <SideBarItem idDynamicHref key={i2} {...props} />
                )
              );
            })}
          </List>
          <Divider />
        </Box>
      ))}
    </StyledDrawer>
  );
}
