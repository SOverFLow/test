"use client";

import { getServices } from "@/app/api/task/action/getServices";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { createClient } from "@/utils/supabase/client";
import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useTransition } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateContract from "../../contract/CreateContract";
type Option = {
  uid: string;
  title: string;
  units: string;
  selling_price_ht: number;
  selling_price_ttc: number;
  buying_price_ht: number;
  buying_price_ttc: number;
  tva: number;
};

const SellingPrice = ({
  departement_id,
  translateObj,
  onAddOption,
  onDeleteOption,
  alreadyAddedOptions = [],
  showList = true,
  workingHours,
  client_id,
  bien_id,
}: {
  departement_id: string;
  translateObj: any;
  onAddOption: (option: any) => void;
  onDeleteOption: (id: number) => void;
  alreadyAddedOptions?: any[];
  showList?: boolean;
  workingHours?: number;
  client_id: string;
  bien_id: string;
}) => {
  const [inputTab, setInputTab] = useState<{
    id: number;
    quantity: number | null;
    selection: Option | null;
  }>({ id: 1, quantity: null, selection: null });
  const supabase = createClient();
  const [addedOptions, setAddedOptions] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [options, setOptions] = useState<Option[]>([]);
  const [showContratDialog, setShowContratDialog] = useState(false);
  const dispatch = useDispatch();

  const CustomListboxComponent = React.forwardRef(
    function CustomListboxComponent(
      props: any,
      ref: React.Ref<HTMLUListElement>
    ) {
      return (
        <ul
          style={{
            padding: 0,
            margin: 0,
            listStyle: "none",
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxHeight: "300px", // Set max height for better usability
            overflowY: "auto", // Enable scrolling if the list is too long
          }}
          {...props}
          ref={ref!}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={2}
            bgcolor="#f9f9f9"
            borderBottom="1px solid #e0e0e0"
            maxWidth={"450px"}
            width={"100%"}
          >
            <CustumButton
              label={
                <>
                  <Add />
                  {translateObj.add_contract}
                </>
              }
              onClick={handleAddContract}
            />
          </Box>
          <Divider
            sx={{
              marginTop: 0,
              marginBottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            }}
          />
          {props.children}
        </ul>
      );
    }
  );

  useEffect(() => {
    const ServiceChannel = supabase
      .channel("realtime:Services_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Service",
          filter: "department_id=eq." + departement_id,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.department_id === departement_id
          ) {
            const newOption = {
              uid: payload.new.uid,
              title: payload.new.title,
              units: payload.new.units,
              selling_price_ht: payload.new.selling_price_ht,
              selling_price_ttc: payload.new.selling_price_ttc,
              buying_price_ht: payload.new.buying_price_ht,
              buying_price_ttc: payload.new.buying_price_ttc,
              tva: payload.new.tva,
            };
            setOptions((prev) => [...prev, newOption]);
          }
        }
      )
      .subscribe();
    return () => {
      ServiceChannel.unsubscribe();
    };
  }, [departement_id, supabase]);

  useEffect(() => {
    const fetchData = async () => {
      startTransition(() => {
        getServices(departement_id, client_id, bien_id).then((data) => {
          if (data?.error) {
            toast.error("Error fetching services", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            const initialOptions = data?.success || [];
            if (alreadyAddedOptions?.length === 0) {
              setOptions(initialOptions);
              return;
            }
            setAddedOptions(alreadyAddedOptions);
            const filteredOptions = initialOptions.filter(
              (option) =>
                !alreadyAddedOptions?.some(
                  (added) => added.selection.uid === option.uid
                )
            );
            setOptions(filteredOptions);
          }
        });
      });
    };
    departement_id && fetchData();
  }, [
    departement_id,
    startTransition,
    JSON.stringify(alreadyAddedOptions),
    bien_id,
    client_id,
  ]);

  const addOption = () => {
    if (inputTab.selection && inputTab.quantity! > 0) {
      const newAddedOptions = [
        ...addedOptions,
        {
          ...inputTab,
          quantity: inputTab.quantity,
          id: addedOptions.length + 1,
        },
      ];
      setAddedOptions(newAddedOptions);
      onAddOption(inputTab);
      setInputTab({ id: inputTab.id + 1, quantity: null, selection: null });
    }
    dispatch({ payload: 6, type: "VerticalSteperSlice/setActiveStep" });
  };

  const updateQuantity = (quantity: any) => {
    setInputTab((prev) => ({ ...prev, quantity: parseInt(quantity, 10) }));
  };

  const updateSelection = (newValue: Option | null) => {
    if (newValue) {
      setInputTab((prev) => ({ ...prev, selection: newValue, quantity: 1 }));
      newValue.units === "h" &&
        workingHours &&
        setInputTab((prev) => ({ ...prev, quantity: workingHours }));
    }
  };

  const deleteOption = (id: number) => {
    const newOptions = addedOptions?.filter((option) => option.id !== id);
    onDeleteOption(id);
    setAddedOptions(newOptions);
  };

  const availableOptions = options.filter(
    (option) =>
      !addedOptions?.some(
        (added) => added.selection && added.selection.uid === option.uid
      )
  );

  const handleAddContract = () => {
    setShowContratDialog(true);
  };

  return (
    <Grid item xs={12}>
      {showContratDialog && (
        <CreateContract
          isOverride={false}
          openDialog={showContratDialog}
          onClose={() => setShowContratDialog(false)}
        />
      )}
      <Grid container display={"flex"} width={"100%"} spacing={1}>
        <Grid item xs={12} md={2.7}>
          <Box
            sx={{
              display: "flex",
              marginTop: "1.6rem",
              justifyContent: "start",
              alignItems: "end",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                color: "#222222",
                display: "flex",
                alignItems: "end",
              }}
            >
              {translateObj.Selling_Price}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={8} md={5.3}>
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
            ListboxComponent={CustomListboxComponent}
            noOptionsText={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f9f9f9"
                borderBottom="1px solid #e0e0e0"
              >
                {/* <span style={{ fontWeight: 500 }}>
                  {translateObj.no_option_found}
                </span> */}
                <CustumButton
                  label={
                    <>
                      <Add />
                      {translateObj.add_contract}
                    </>
                  }
                  onClick={handleAddContract}
                />
              </Box>
            }
          />
        </Grid>
        <Grid item xs={4} md={2.5}>
          <TextField
            type="number"
            placeholder="Quantity"
            value={inputTab.quantity}
            onChange={(e) => updateQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            variant="standard"
            fullWidth
            helperText={
              inputTab.selection
                ? `Unit: ${inputTab.selection.units}`
                : "Select a service to see unit"
            }
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={1.5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={addOption}
            sx={{
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              fontWeight: 550,
              width: "100%",
              maxWidth: "300px",
              padding: "10px",
              height: "2rem",
              color: "white",
              textTransform: "none",
            }}
          >
            {translateObj.add}
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ width: "100%" }}>
          {addedOptions.map((option, index) => (
            <ListItem
              key={index}
              sx={{
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography sx={{ display: "inline-block" }}>
                {"\u2022 "}
                <b>
                  {translateObj.Service} {option.id}
                </b>
                {":"} {option.selection.title} {", "}
                <b>{translateObj.Quantity}</b>
                {":"} {option.quantity} {option.selection.units}
                {", "}
                <b>{translateObj.Selling_Price_HT}</b>
                {":"} {option.selection.selling_price_ht} {", "}
                <b>{translateObj.Selling_Price_ttc}</b>
                {":"} {option.selection.selling_price_ttc}
              </Typography>
              <IconButton
                sx={{
                  alignSelf: "center",
                  margin: "0.5rem",
                  padding: "0.5rem",
                }}
                onClick={() => deleteOption(option.id)}
              >
                <Close
                  sx={{
                    color: "red",
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                  }}
                />
              </IconButton>
            </ListItem>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SellingPrice;
