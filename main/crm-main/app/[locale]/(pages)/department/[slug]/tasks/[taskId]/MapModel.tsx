"use client";
import { Grid, IconButton } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import dynamic from "next/dynamic";

import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useState } from "react";

const Map = dynamic(() => import("@/components/ui/Map/Map"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

interface props {
  Latitude: number ;
  Longitude: number;
}

export default function MapModel(props: props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpenDialog}>
        <MapIcon />
      </IconButton>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        sx={{ width: "100%" }}
      >
        <DialogContent>
          <Grid
            container
            sx={{ width: "100%", height: "30rem", padding: "0px" }}
          >
            <Map latitude={props.Latitude} longitude={props.Longitude} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <CustumButton label="Cancel" onClick={handleCloseDialog} />
        </DialogActions>
      </Dialog>
    </>
  );
}
