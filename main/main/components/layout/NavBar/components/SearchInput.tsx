import React, { useState } from "react";
import {
  Modal,
  Box,
  InputBase,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SearchPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: "600px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  paddingRight: `calc(1em + ${theme.spacing(4)})`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  "& .MuiInputBase-input": {
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

function SearchInput() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton aria-label="search" color="inherit" onClick={handleOpen}>
        <SearchIcon />
      </IconButton>
      <StyledModal open={open} onClose={handleClose}>
        <SearchPaper elevation={1}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Search
          </Typography>
          <StyledInputBase
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
            autoFocus
          />
          <List component="nav" aria-label="search results">
            <ListItem button>
              <ListItemText primary="Invoices" secondary="Menu" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Create invoice" secondary="Page" />
            </ListItem>
          </List>
        </SearchPaper>
      </StyledModal>
    </>
  );
}

export default SearchInput;
