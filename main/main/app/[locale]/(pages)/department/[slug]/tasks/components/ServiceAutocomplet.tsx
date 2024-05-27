import React from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import CreateContract from "../../contract/CreateContract";

interface props {
  inputTab: {
    id: number;
    quantity: number | null;
    selection: any;
  };
  updateSelection: (newValue: any) => void;
  availableOptions: any[];
  translateObj: any;
  handleAddContract: () => void;
}

const ServiceAutocomplet = ({
  inputTab,
  updateSelection,
  availableOptions,
  translateObj,
  handleAddContract,
}: props) => {
  return (
    <Autocomplete
      value={inputTab.selection}
      onChange={(event, newValue) => updateSelection(newValue)}
      options={availableOptions}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={translateObj.select_service}
          variant="standard"
          fullWidth
        />
      )}
      noOptionsText={
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <span>No service found Add new</span>
          <CreateContract isOverride={false} />
          {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddContract}
              style={{ marginLeft: "10px" }}
              startIcon={<Add />}
            >
              Add new
            </Button> */}
          {/* </CreateContract> */}
        </Box>
      }
    />
  );
};

export default ServiceAutocomplet;
