"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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

import theme from "@/styles/theme";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getBienData } from "./utils";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import dynamic from "next/dynamic";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useTranslations } from "next-intl";
import { bienSchema } from "@/utils/schemas/bien/bienSchema";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";
import CreateClient from "../../clients/CreateClient";
import { getDepartementClients } from "../CreateBien/actions";
import { fetchClients } from "@/utils/supabase/fetchClients";
const Map = dynamic(() => import("@/components/ui/Map/Map"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

interface EditBienProps {
  bien_id: number | string;
  dialogOpen?: boolean;
}

export default function EditBien(props: EditBienProps) {
  const supabase = createClient();
  const t = useTranslations("Biens");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLatitude, setnewLatitude] = useState(48.8588897);
  const [newLongitude, setLongitude] = useState(2.3200410217200766);
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState<any>("");
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [isPending, startTransition] = React.useTransition();
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
      uid: "",
      name: "",
    },
  });
  const [clients, setClients] = useState<{ uid: any; name: string }[]>([]);
  const [dialogOpenClient, setDialogOpenClient] = useState(false);

  const mapAdress = useSelector(
    (state: RootState) => state?.addressReducer?.address
  );

  useEffect(() => {
    setAddress(mapAdress);
  }, [mapAdress]);

  useEffect(() => {
    async function getLatAndLong() {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        )
        .then((response) => {
          if (address.length > 0) {
            setnewLatitude(parseFloat(response.data.features[0].center[1]));
            setLongitude(parseFloat(response.data.features[0].center[0]));
          }
        })
        .catch((error) => console.log("Error:", error));
    }
    getLatAndLong();
  }, [address]);

  useEffect(() => {
    if (!departmentId || !props.bien_id) {
      console.log("No department id");
      return;
    }
    // console.log("aloooooooooooooooooooooooooooooooooooooooo", props.bien_id);

    const getClients = async () => {
      startTransition(() => {
        getDepartementClients(departmentId).then((data) => {
          if (data.data) {
            // console.log("clients", data.data);
            console.log("data.data", data.data);
            setClients(data.data);
          }
          console.log("getClients error:", data.error);
          console.log("departement_id", departmentId);
          console.log("props.bient_id", props.bien_id);
          console.log("==================");
        });
      });
    };
    getClients();
  }, [departmentId, props.bien_id]);

  useEffect(() => {
    // Get the department's clients

    if (props.bien_id) {
      getBienData(props.bien_id)
        .then((data: any) => {
          // console.log("+---clients", clients);
          // console.log("+---data", data);
          // console.log("+---newBien", newBien);
          let tmpClient = clients.find(
            (client) => client.uid === data.client_id
          );
          data && setAddress(data.location);
          data &&
            setNewBien({
              name: data.name,
              type: data.type,
              // price: data.price,
              description: data.description,
              location: data.location,
              zip_code: data.zip_code,
              city: data.city,
              state_province: data.state_province,
              country: data.country,
              phone: data.phone,
              status: data.status,
              client: tmpClient || {
                uid: "",
                name: "",
              },
            });
        })
        .catch((error) => console.error(error));
    }
  }, [props.bien_id, clients]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setAddress(input);

    if (input.length > 1) {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }&limit=5`
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
      setAddress(input);
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
    setAddress(suggestion.place_name);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "price") {
      setNewBien((prevState: any) => ({
        ...prevState,
        [name]: parseInt(value),
      }));
      return;
    }
    setNewBien((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    // console.log("newBien", newBien);

    const returnvalue = bienSchema.safeParse({ ...newBien, location: address });
    if (returnvalue.success) {
      const { data, error } = await supabase
        .from("Bien")
        .update({
          name: newBien.name,
          type: newBien.type,
          // price: newBien.price,
          description: newBien.description,
          location: address,
          zip_code: newBien.zip_code,
          city: newBien.city,
          state_province: newBien.state_province,
          country: newBien.country,
          phone: newBien.phone,
          status: newBien.status,
          client_id: newBien.client.uid,
        })
        .eq("uid", props.bien_id);
      if (error) {
        toast.error("Error Editing Bien", {
          position: "bottom-right",
        });
      } else {
        toast.success("Bien Edited successfully", {
          position: "bottom-right",
        });
      }
      setErrors({});
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

  function handleOpenClient() {
    setDialogOpenClient(false);
  }

  useEffect(() => {
    console.log("departmentId", departmentId);
    if (!departmentId) return;
    const clientChannel = supabase
      .channel("realtime:client_status_editbien")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_department",
          filter: "department_id=eq." + departmentId,
        },
        async (payload) => {
          console.log("payload", payload);
          if (payload.eventType === "INSERT") {
            console.log("payload.new", payload.new);
            const data = await fetchClients(payload.new.client_id);
            if (data) {
              console.log("--------gg---data", data);
              let clientsCopy = [...clients];
              clientsCopy.push({
                uid: data.uid,
                name: data.first_name + " " + data.last_name,
              });
              setClients(clientsCopy);
              // setNewBien((prevState: any) => ({
              //   ...prevState,
              //   client: {
              //     uid: data.uid,
              //     name: data.first_name + " " + data.last_name,
              //   },
              // }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      clientChannel.unsubscribe();
    };
  }, [supabase, departmentId]);

  useEffect(() => {
    console.log("--------9-clients", clients);
  }, [clients]);

  return (
    <Box>
      <Button
        variant="text"
        color="info"
        onClick={handleOpenDialog}
        sx={{
          width: "30px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        size="small"
        title={t("edit-bien")}
      >
        <EditIcon />
      </Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullScreen>
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 20 }}
            open={isPending}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop> */}
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
              {t("edit-bien")}
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
              {isPending ? (
                <Box
                  display={"flex"}
                  mx={1}
                  my={2}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  mb={0}
                >
                  <CircularProgress />
                  <Box component="span" marginLeft={2}>
                    Loading...
                  </Box>
                </Box>
              ) : (
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
                      disabled={isPending}
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
                      }}
                      label={
                        <>
                          add client
                          {/* <AddCircleOutlineIcon /> */}
                        </>
                      }
                    />

                    {dialogOpenClient && (
                      <CreateClient
                        isDisabled={isPending}
                        isFromBien
                        openSteper={handleOpenClient}
                      />
                    )}
                  </Box>
                </Box>
              )}
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
                    <InputLabel>Status </InputLabel>
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
                margin="dense"
                multiline
                rows={4}
                label={t("description")}
                type="text"
                fullWidth
                name="description"
                value={newBien.description || ""}
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
