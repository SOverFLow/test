"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setAddress } from "@/store/addressSlice";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { Dialog, DialogContent, TextField } from "@mui/material";
import dynamic from "next/dynamic";
import theme from "@/styles/theme";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { stockSchema } from "@/utils/schemas/stock/stockSchema";
import { MultiAutocomplete } from "@/components/ui/MultiAutocomplete/MultiAutocomplete";
import { getProducts } from "./utils";
import CreateProduct from "../../products/CreateProduct";
import { createClient } from "@/utils/supabase/client";
import Close from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { Add } from "@mui/icons-material";
const Map = dynamic(() => import("@/components/ui/Map/Map"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

export default function CreateStock({
  open = true,
  onClose,
}: {
  onClose: () => void;
  open?: boolean;
}) {
  const t = useTranslations("Stock");
  const dispatch = useDispatch();
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [productsNames, setProductsNames] = useState([]);
  const [products, setProducts] = useState<any>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { name: string; image: string; id: string }[]
  >([]);
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLatitude, setnewLatitude] = useState(48.8588897);
  const [newLongitude, setLongitude] = useState(2.3200410217200766);
  const [suggestions, setSuggestions] = useState([]);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const address = useSelector(
    (state: RootState) => state?.addressReducer?.address
  );

  const [newStock, setNewStock] = useState({
    expiry_date: "",
    location: address,
    type: "",
    payment_method: "",
    purchase_date: "",
    // quantity: 0.0,
    name: "",
  });

  useEffect(() => {
    console.log("open", open);
    if (open) {
      setDialogOpen(true);
    }
  }, [open]);
  useEffect(() => {
    console.log("=========================> create stock L:");
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
    const productChannel = supabase
      .channel("realtime:productChannel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Product",
          filter: "department_id=eq." + departmentId,
        },
        (payload: any) => {
          console.log(payload.eventType);
          console.log(payload.new);
          if (payload.eventType === "INSERT") {
            setProducts((prevClients: any) => [
              ...prevClients,
              {
                uid: payload.new.uid,
                name: payload.new.name,
                price: payload.new.price,
                image: payload.new.image ?? "/images/product.png",
                id: payload.new.id,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      productChannel.unsubscribe();
    };
  });

  const handleCloseDialog = () => {
    onClose();
    setDialogOpen(false);
  };

  const handleSelectedValuesChange = (
    newValues: { name: string; image: string }[]
  ) => {
    const productInfo = newValues.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image,
    }));

    setSelectedProducts(productInfo);

    const newUids = products
      .filter((product: any) =>
        newValues.some((item) => item.name === product.name)
      )
      .map((product: any) => product.uid);
    setSelectedUids(newUids);
  };

  useMemo(() => {
    if (departmentId) {
      getProducts(departmentId)
        .then((data) => {
          if (data) {
            setProducts(data ?? []);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId]);

  useEffect(() => {
    const productInfo = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
    }));
    setProductsNames(productInfo);
  }, [products]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("name, value", name, value);

    if (name === "purchase_date" || name === "expiry_date") {
      setNewStock((prevState: any) => ({
        ...prevState,
        [name]: new Date(value),
      }));
      return;
    }
    setNewStock((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
      dispatch(setAddress(input));
      setNewStock({
        ...newStock,
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
    setNewStock({
      ...newStock,
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

  const onSubmit = async () => {
    await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      )
      .then((response) => {
        setNewStock({
          ...newStock,
          ["location"]: address,
        });
      })
      .catch((error) => console.log("Error:", error));
    // console.log("newStock", newStock);

    const returnvalue = stockSchema.safeParse({
      ...newStock,
      location: address,
      products: selectedProducts[0]?.name,
    });
    if (returnvalue.success) {
      console.log("s-newStock", newStock);
      const allData = {
        ...newStock,
        department_id: departmentId,
        location: address,
        products: selectedUids,
      };
      try {
        await axios.post("/api/Stock", allData);
        setProductsNames(
          productsNames.filter(
            (product: any) =>
              !selectedProducts.some(
                (selectedProduct) => selectedProduct.id === product.id
              )
          )
        );
        toast.success("Stock Added successfully", {
          position: "bottom-right",
        });
        setErrors({});
      } catch (error) {
        toast.error("Error submitting Stock", {
          position: "bottom-right",
        });
      }

      setNewStock({
        expiry_date: "",
        location: "",
        payment_method: "",
        purchase_date: "",
        // quantity: 0.0,
        name: "",
        type: "",
      });
      setSelectedProducts([]);

      onClose();
    } else {
      console.log("e-newStock", newStock);
      console.log("returnvalue.error.issues", returnvalue.error.issues);
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

  return (
    <Box>
      <Dialog open={open} onClose={handleCloseDialog} fullScreen>
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
              {t("create-new-stock")}
            </Typography>
            {/* <CustumButton label={t("save")} onClick={onSubmit} /> */}
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid
            container
            sx={{ width: "40rem", height: "20rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    placeholder={t("name-of-stock")}
                    type="text"
                    fullWidth
                    name="name"
                    value={newStock.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <FormError error={errors.name} />}
                </Box>
              </Box>

              <TextField
                margin="dense"
                placeholder={t("location")}
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
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Box width={"100%"}>
                  <MultiAutocomplete
                    label={t("products")}
                    placeholder={t("select-products")}
                    names={productsNames}
                    onSelectedValuesChange={handleSelectedValuesChange}
                    defaultValue={selectedProducts}
                  />
                </Box>
                <Box mt={0.8}>
                  <CustumButton
                    label={
                      <>
                        <Add />
                        {t('create-product')}
                      </>
                    }
                    onClick={() => setOpenCreateProduct(true)}
                  />
                </Box>
              </Box>

              {errors.products && <FormError error={errors.products} />}
              <Box
                display={"flex"}
                mt={2}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <FormControl
                    margin="dense"
                    sx={{ mt: 1 }}
                    fullWidth
                    error={Boolean(errors.status_sale)}
                  >
                    <InputLabel>{t("payment-method")} </InputLabel>

                    <Select
                      //placeholder={t("payment-method")}
                      name="payment_method"
                      value={newStock.payment_method}
                      onChange={(event: SelectChangeEvent<string>) =>
                        setNewStock((prevState) => ({
                          ...prevState,
                          ["payment_method"]: event.target.value,
                        }))
                      }
                      inputProps={{}}
                      // // hiddenLabel
                      // placeholder="payment method"
                      label={t("payment-method")}
                    >
                      <MenuItem value="Cash">{t("cash")}</MenuItem>
                      <MenuItem value="Check">{t("check")}</MenuItem>
                      <MenuItem value="Credit Card">
                        {t("credit-card")}
                      </MenuItem>
                      <MenuItem value="External">{t("external")}</MenuItem>
                    </Select>
                    {errors.status && <FormError error={errors.status} />}
                  </FormControl>
                  {errors.payment_method && (
                    <FormError error={errors.payment_method} />
                  )}
                </Box>
                <Box width={"100%"}>
                  <FormControl
                    margin="dense"
                    sx={{ mt: 1 }}
                    fullWidth
                    error={Boolean(errors.status_sale)}
                  >
                    <InputLabel>Stock type</InputLabel>

                    <Select
                      name="type"
                      value={newStock.type}
                      onChange={(event: SelectChangeEvent<string>) =>
                        setNewStock((prevState) => ({
                          ...prevState,
                          ["type"]: event.target.value,
                        }))
                      }
                      inputProps={{}}
                      label={t("stock-type")}
                    >
                      <MenuItem value="physical">{t("physical")}</MenuItem>
                      <MenuItem value="virtual">{t("virtual")}</MenuItem>
                    </Select>
                    {errors.status && <FormError error={errors.status} />}
                  </FormControl>
                  {errors.type && <FormError error={errors.type} />}
                </Box>
              </Box>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("purchase-date")}
                    type="date"
                    fullWidth
                    name="purchase_date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                  />
                  {errors.purchase_date && (
                    <FormError error={errors.purchase_date} />
                  )}
                </Box>
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("expiry-date")}
                    type="date"
                    fullWidth
                    name="expiry_date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                  />
                  {errors.expiry_date && (
                    <FormError error={errors.expiry_date} />
                  )}
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
      {openCreateProduct && (
        <CreateProduct
          open={openCreateProduct}
          handleClose={() => setOpenCreateProduct(false)}
        />
      )}
    </Box>
  );
}
