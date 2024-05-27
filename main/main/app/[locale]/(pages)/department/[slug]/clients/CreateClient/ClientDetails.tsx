import React from "react";
import {
  Box,
  FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";

interface ClientDetailsProps {
  newClientData: any;
  setNewClientData: (data: any) => void;
  clientErrors: any;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  newClientData,
  setNewClientData,
    clientErrors,
}) => {
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewClientData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      {/* <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        
      </Box> */}
    </>
  );
};

export default ClientDetails;
