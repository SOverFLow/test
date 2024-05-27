"use client";
import {
  Box,
  Button
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import ComponentEditService from "./ComponentEditService";

interface EditServiceProps {
  serviceId: string;
  tvaList: any;
  setTvaList: any;
  familyList: any;
  setFamilyList: any;
}


export default function EditService({ serviceId, tvaList, setTvaList, familyList, setFamilyList }: EditServiceProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);


  const handleDialogState = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <Box>
      <Box>
        <Button
          variant="text"
          color="info"
          onClick={handleDialogState}
          sx={{
            width: "30px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          size="small"
          title="edit client"
        >
          <EditIcon />
        </Button>
      </Box>
      {dialogOpen && <ComponentEditService dialogOpen={dialogOpen} handleDialogState={handleDialogState} serviceId={serviceId} tvaList={tvaList} setTvaList={setTvaList} familyList={familyList} setFamilyList={setFamilyList} />}
    </Box>
  );
}
