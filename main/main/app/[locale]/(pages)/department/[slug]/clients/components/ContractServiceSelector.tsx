import React, { use, useEffect, useMemo, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import theme from "@/styles/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ClientFetchContract } from "./utils/utils";
import CreateContract from "../../contract/CreateContract";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

interface ContractServiceProps {
  setNewClientData: (data: any) => void;
  client_id: string;
  isDisabled?: boolean;
  clientName?: string;
}

const ContractServiceSelector: React.FC<ContractServiceProps> = ({
  setNewClientData,
  client_id,
  isDisabled,
  clientName,
}) => {
  const supabase = createClient();
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedContract, setSelectedContract] = useState("");
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const t = useTranslations("client");

  useEffect(() => {
    const contractsChannel = supabase
      .channel("realtime:contractsChannel_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Contract" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setContracts((prevContract: any) => [
              ...prevContract,
              {
                title: payload.new.name,
                uid: payload.new.uid,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      contractsChannel.unsubscribe();
    };
  });

  useEffect(() => {
    if (client_id) {
      setNewClientData((prevState: any) => ({
        ...prevState,
        ["client_id"]: client_id,
      }));
    }
  }, [client_id,setNewClientData]);

  useMemo(() => {
    const fetchContracts = async () => {
      department_id &&
        ClientFetchContract(department_id,client_id).then((data) => {
          data && setContracts(data);
        });
    };

    fetchContracts();
  }, [department_id,client_id]);

  const handleContractChange = (event: any) => {
    setSelectedContract(event.target.value as string);
    setNewClientData((prevState: any) => ({
      ...prevState,
      ["contract_id"]: event.target.value,
      ["service_id"]: null,
    }));
  };

  return (
    <>
      <Grid
        container
        display={"flex"}
        width={"100%"}
        spacing={1}
        sx={{ marginTop: "10px", marginLeft: "10px" }}
      >
        {/* <Grid item xs={9} md={9} sx={{ marginBottom: "10px" }}>
          <Alert
            variant="filled"
            severity={"info"}
            sx={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {t("please-select-a-contract-or-a-service")}{" "}
          </Alert>
        </Grid> */}
        <Grid item xs={9} md={9}>
          <FormControl fullWidth>
            <InputLabel id="contract-select-label">{t("contract")}</InputLabel>
            <Select
              labelId="contract-select-label"
              id="contract-select"
              value={selectedContract}
              label={t("contract")}
              onChange={handleContractChange}
            >
              {contracts.map((contract) => (
                <MenuItem key={contract.uid} value={contract.uid}>
                  {contract.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={2}
          md={3}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"end"}
        >
          <CreateContract isOverride={true} client_id={client_id} clientName={clientName}>
            <Button
              disabled={isDisabled}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 550,
                textTransform: "none",
                minWidth: "108px",
                color: "#fff",
                backgroundColor: theme.palette.primary.main,
                marginBottom: "10px",
              }}
            >
              {t("add-contract")}{" "}
            </Button>
          </CreateContract>
        </Grid>
      </Grid>
    </>
  );
};

export default ContractServiceSelector;
