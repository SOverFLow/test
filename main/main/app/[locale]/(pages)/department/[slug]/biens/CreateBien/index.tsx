"use client";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Autocomplete,
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from "@mui/material";
import { Dialog, DialogContent, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import theme from "@/styles/theme";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useTranslations } from "next-intl";
import { bienSchema } from "@/utils/schemas/bien/bienSchema";
import createBien, { getDepartementClients } from "./actions";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import dynamic from "next/dynamic";
import { setAddress } from "@/store/addressSlice";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";
import { MultiAutocomplete } from "@/components/ui/MultiAutocomplete/MultiAutocomplete";
import CreateProduct from "../../products/CreateProduct";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateClient from "../../clients/CreateClient";
import { createClient } from "@/utils/supabase/client";
import { fetchClients } from "@/utils/supabase/fetchClients";
const Map = dynamic(() => import("@/components/ui/Map/Map"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

type myClient = {
  uid: string;
  name: string;
};

interface props {
  children?: React.ReactNode;
  isOverride?: boolean;
  canCreateClient?: boolean;
  style?: React.CSSProperties;
  myClient?: myClient;
  ref?: any;
  // isFromCreateClient?: boolean;
  // isFromEditClient?: boolean;
}

export default function CreateBien({
  children,
  isOverride = false,
  myClient,
  canCreateClient = true,
  // isFromEditClient = false,
  style,
}: props) {
  const dispatch = useDispatch();
  const t = useTranslations("Biens");
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useState(
    myClient?.uid && canCreateClient ? true : false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLatitude, setnewLatitude] = useState(48.8588897);
  const [newLongitude, setLongitude] = useState(2.3200410217200766);
  const [suggestions, setSuggestions] = useState([]);
  const address = useSelector(
    (state: RootState) => state.addressReducer.address
  );
  const [newBien, setNewBien] = useState({
    name: "",
    type: "",
    // price: 0,
    description: "",
    location: address,
    zip_code: "",
    city: "",
    state_province: "",
    country: "",
    phone: "",
    status: "",
    client: {
      uid: myClient?.uid || "",
      name: myClient?.name || "",
    },
  });
  const [clients, setClients] = useState<{ uid: any; name: string }[]>([]);

  useEffect(() => {
    if (myClient) {
      // console.log("myClient", myClient);
      setNewBien((prevState) => ({
        ...prevState,
        client: {
          uid: myClient.uid,
          name: myClient.name,
        },
      }));
    }
  }, [myClient]);

  useEffect(() => {
    // Get the user's location
    const getLocation = () => {
      if (!navigator.geolocation) {
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setnewLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {}
      );
    };

    getLocation();
  }, []);

  useEffect(() => {
    // Get the department's clients

    const getClients = async () => {
      if (!departmentId) {
        // console.log("No department id");
        return;
      }
      startTransition(() => {
        getDepartementClients(departmentId).then((data) => {
          if (data?.data) {
            // console.log("clients", data.data);
            setClients(data.data);
          }
          // console.log("getClients error:", data.error);
        });
      });
    };
    getClients();
  }, [departmentId]);

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    dispatch(setAddress(input));

    if (input.length > 1) {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5`
        )
        .then((response) => {
          setSuggestions(response.data.features);
        })
        .catch((error) => console.log("Error:", error));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      const input = event.target.value;
      dispatch(setAddress(input));
      setNewBien({
        ...newBien,
        ["location"]: input,
      });
      setSuggestions([]);
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        )
        .then((response) => {
          setnewLatitude(parseFloat(response.data.features[0].center[1]));
          setLongitude(parseFloat(response.data.features[0].center[0]));
        })
        .catch((error) => console.log("Error:", error));
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    dispatch(setAddress(suggestion.place_name));
    setNewBien({
      ...newBien,
      ["location"]: suggestion.place_name,
    });
    setSuggestions([]);
    await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          suggestion.place_name
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      )
      .then((response) => {
        setnewLatitude(parseFloat(response.data.features[0].center[1]));
        setLongitude(parseFloat(response.data.features[0].center[0]));
      })
      .catch((error) => console.log("Error:", error));
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    name === "price"
      ? setNewBien((prevState) => ({ ...prevState, [name]: +value }))
      : setNewBien((prevState) => ({
          ...prevState,
          [name]: value,
        }));
  };

  const [isPending, startTransition] = React.useTransition();
  const onSubmit = async () => {
    const returnvalue = bienSchema.safeParse({ ...newBien, location: address });

    if (returnvalue.success) {
      const allData = {
        ...newBien,
        department_id: departmentId,
        location: address,
      };
      try {
        startTransition(() => {
          createBien(departmentId, allData).then((data) => {
            if (data.error) {
              throw new Error(data.error);
            }
            toast.success("Bien Added successfully", {
              position: "bottom-right",
            });
          });
        });
      } catch (error) {
        toast.success("Error adding Bien", {
          position: "bottom-right",
        });
      }
      setErrors({});

      setNewBien({
        name: "",
        type: "",
        // price: 0,
        description: "",
        location: "",
        zip_code: "",
        city: "",
        state_province: "",
        country: "",
        status: "",
        phone: "",
        client: {
          uid: "",
          name: "",
        },
      });
      setDialogOpen(false);
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
      toast.error(t("fill-the-required-fields"), {
        position: "bottom-right",
      });
    }
  };
  const [dialogOpenClient, setDialogOpenClient] = useState(false);

  function handleOpenClient() {
    setDialogOpenClient(false);
  }

  const supabase = createClient();

  useEffect(() => {
    console.log("departmentId", departmentId);
    const clientChannel = supabase
      .channel("realtime:client_status_createbien")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_department",
          filter: "department_id=eq." + departmentId,
        },
        async (payload) => {
          console.log("-----------payload", payload);
          if (payload.eventType === "INSERT") {
            console.log("-----------payload.new", payload.new);
            const data = await fetchClients(payload.new.client_id);
            if (data) {
              console.log("--------gg---data", data);
              setClients((prevClients: any) => [
                ...prevClients,
                {
                  uid: data.uid, // Access the uid property from the data array element
                  name: data.first_name + " " + data.last_name, // Access the name property from the data array element
                },
              ]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      clientChannel.unsubscribe();
    };
  }, [supabase, departmentId]);

  // useEffect(() => {
  //   console.log("*--**-**clients", clients);
  // }, [clients]);
  return (
    <Box>
      <Box width="100%">
        {isOverride ? (
          <Box width="100%" onClick={handleOpenDialog}>
            {children}
          </Box>
        ) : (
          <CustumButton
            label={
              <>
                {children ? (
                  children
                ) : (
                  <>
                    <AddIcon />
                    {t("create-new-bien")}
                  </>
                )}
              </>
            }
            onClick={handleOpenDialog}
          />
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullScreen>
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              sx={{ marginLeft: "1rem" }}
            >
              <Close
                sx={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: theme.palette.primary.main,
                }}
              />
            </IconButton>

            <Typography
              sx={{
                marginLeft: "1rem",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: theme.palette.primary.main,
                flex: 1,
                textAlign: "center",
              }}
            >
              {t("create-new-bien")}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Grid
            container
            sx={{ width: "30rem", height: "23rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label={t("name")}
                type="text"
                fullWidth
                name="name"
                value={newBien.name}
                onChange={handleInputChange}
              />
              {errors.name && <FormError error={errors.name} />}

              <TextField
                autoFocus
                margin="dense"
                label={t("type")}
                type="text"
                fullWidth
                name="type"
                value={newBien.type}
                onChange={handleInputChange}
              />
              {errors.type && <FormError error={errors.type} />}
              {canCreateClient ? (
                <Box display={"flex"} gap={2} alignItems={"center"} mb={0}>
                  <Box width={"100%"} mb={0}>
                    <Autocomplete
                      value={newBien.client}
                      options={clients}
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={"suggs-" + option.uid}>
                            {option.name}
                          </li>
                        );
                      }}
                      onChange={(event, value: any) => {
                        // console.log("value", value);
                        setNewBien((prevState: any) => ({
                          ...prevState,
                          client: value,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={"Select Client"}
                          sx={{
                            "& .MuiInputBase-root": {
                              backgroundColor: grey[100],
                              height: "3.2rem",
                              width: "100%",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box mt={0.8}>
                    <CustumButton
                      onClick={() => {
                        setDialogOpenClient(true);
                      }}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 550,
                        height: "3rem",
                        width: "100%",
                        textTransform: "none",
                        color: "#fff",
                        backgroundColor: theme.palette.primary.main,
                        // maxHeight: "2.3rem",
                      }}
                      label={
                        <>
                          add client
                          {/* <AddCircleOutlineIcon /> */}
                        </>
                      }
                    />

                    {dialogOpenClient && (
                      <CreateClient isFromBien openSteper={handleOpenClient} />
                    )}
                  </Box>
                </Box>
              ) : (
                <Box display={"flex"} gap={2} alignItems={"center"} mb={0}>
                  <Box width={"100%"} mb={0}>
                    <Autocomplete
                      disabled
                      value={newBien.client}
                      options={[myClient]}
                      getOptionLabel={(option) => option!.name}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={"sugg-" + option!.uid}>
                            {option!.name}
                          </li>
                        );
                      }}
                      onChange={(event, value: any) => {
                        // console.log("value", value);
                        setNewBien((prevState: any) => ({
                          ...prevState,
                          client: value,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={"Client"}
                          placeholder={"Select Client"}
                          sx={{
                            "& .MuiInputBase-root": {
                              backgroundColor: grey[100],
                              height: "3.2rem",
                              width: "100%",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              )}
              {errors.client && <FormError error={errors.client} />}
              <PhoneInput
                specialLabel=""
                country={"fr"}
                value={newBien.phone}
                inputStyle={{
                  width: "100%",

                  height: "2.8rem",
                  margin: "4px 0px",
                  backgroundColor: grey[100],
                }}
                onChange={(phone: string) =>
                  handleInputChange({
                    target: { name: "phone", value: phone },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                placeholder={t("enter-phone-number")}
              />
              {errors.phone && <FormError error={errors.phone} />}

              <Box
                display={"flex"}
                gap={"0.5rem"}
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-around",
                  alignItems: "top",
                  mt: 0.5,
                }}
              >
                <Box width={"100%"}>
                  <FormControl
                    sx={{ mt: 1 }}
                    fullWidth
                    error={Boolean(errors.status_sale)}
                  >
                    <InputLabel>{t("status")} </InputLabel>
                    <Select
                      name="status"
                      value={newBien.status}
                      onChange={(event: SelectChangeEvent<string>) =>
                        setNewBien((prevState) => ({
                          ...prevState,
                          ["status"]: event.target.value,
                        }))
                      }
                      label={t("status")}
                    >
                      <MenuItem value="Open">{t("open")}</MenuItem>
                      <MenuItem value="Close">{t("close")}</MenuItem>
                    </Select>
                    {errors.status && <FormError error={errors.status} />}
                  </FormControl>
                </Box>
                {/* <Box width={"100%"}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label={t("price")}
                    type="number"
                    fullWidth
                    name="price"
                    value={newBien.price}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleInputChange}
                  />
                  {errors.price && <FormError error={errors.price} />}
                </Box> */}
              </Box>

              <TextField
                autoFocus
                multiline
                rows={4}
                margin="dense"
                label={t("description")}
                type="text"
                fullWidth
                name="description"
                value={newBien.description}
                onChange={handleInputChange}
              />
              {errors.description && <FormError error={errors.description} />}

              <Grid container sx={{ width: "100%", height: "20rem" }}>
                <Grid item md={12} xs={12}>
                  <TextField
                    margin="dense"
                    label={t("location")}
                    type="text"
                    fullWidth
                    name="location"
                    value={address}
                    onChange={handleAddressChange}
                    onKeyDown={handleKeyPress}
                  />
                  {suggestions.length > 0 && (
                    <List
                      component="nav"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {suggestions.map((suggestion: any, index) => (
                        <ListItem
                          button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <ListItemText primary={suggestion.place_name} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {errors.location && <FormError error={errors.location} />}
                  <Map latitude={newLatitude} longitude={newLongitude} />
                </Grid>
              </Grid>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    fullWidth
                    label={t("zip-code")}
                    name="zip_code"
                    value={newBien.zip_code}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.zip_code && <FormError error={errors.zip_code} />}
                </Box>

                <Box width={"100%"}>
                  <TextField
                    fullWidth
                    label={t("city")}
                    name="city"
                    value={newBien.city}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.city && <FormError error={errors.city} />}
                </Box>
              </Box>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    fullWidth
                    label={t("state-province")}
                    name="state_province"
                    value={newBien.state_province}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.state_province && (
                    <FormError error={errors.state_province} />
                  )}
                </Box>

                <Box width={"100%"}>
                  <TextField
                    fullWidth
                    label={t("country-0")}
                    name="country"
                    value={newBien.country}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.country && <FormError error={errors.country} />}
                </Box>
              </Box>
              <Grid
                item
                md={12}
                xs={12}
                marginTop={"1rem"}
                justifyContent={"end"}
                alignItems={"end"}
                display={"flex"}
                marginBottom={"1rem"}
              >
                <CustumButton
                  label={t("save")}
                  onClick={onSubmit}
                  style={{
                    width: "150px",
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
