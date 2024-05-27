"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { Dialog, DialogContent, TextField } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { ProductSchema } from "@/utils/schemas/Product/ProductSchema";
import { getSuppliers, uploadProductImage } from "./actions";
import AddProductImage from "./AddProductImage";
import TabSelect from "@/components/ui/TabSelect/TabSelect";
import Close from "@mui/icons-material/Close";
import ProductDetails from "./ProductDetails";
import CreateSupplier from "../../suppliers/CreateSupplier";
import { useTranslations } from "next-intl";
import Add from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import theme from "@/styles/theme";
import MyTabSelect from "@/components/ui/TabSelect/MyTabSelect";

interface props {
  open: boolean;
  handleClose: () => void;
}

function calcTTC(price: number, tva: number) {
  return (price * (tva / 100 + 1)).toFixed(2);
}

export default function CreateProduct({ open, handleClose }: props) {
  const supabase = createClient();
  const t = useTranslations("product");
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [supplierNames, setSupplierNames] = useState([]);
  const [suppliers, setSuppliers] = useState<any>([]);
  const [tvaListValue, setTvaListValue] = useState<
    {
      uid: string;
      value: number;
    }[]
  >([]);
  const [tvaList, setTvaList] = useState<
    {
      uid: string;
      name: string;
    }[]
  >([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 1,
    buy_price: 0.0,
    sell_price: 0.0,
    supplier_id: null,
    entry_date: new Date(),
    exit_date: new Date(),
    expiration_date: new Date(),
    payment_method: "",
    weight: 0.0,
    length: 0.0,
    width: 0.0,
    height: 0.0,
    area: 0.0,
    volume: 0.0,
    country_of_origin: "",
    state_province_of_origin: "",
    serial_number: "",
    stock_limit_for_alert: 0,
    desired_stock: 0,
    nature_of_product: "",
    notes: "",
    buy_tva: null,
    sell_tva: null,
  });

  function getProductFamilies() {
    return [
      t("electronics"),
      t("apparel"),
      t("home-appliances"),
      t("personal-care"),
      t("furniture"),
      t("toys-and-games"),
      t("automotive"),
      t("sports-and-outdoor-equipment"),
      t("health-and-wellness"),
      t("office-supplies"),
      t("pet-care"),
      t("kitchenware"),
      t("beauty-products"),
      t("books-and-media"),
      t("tools-and-hardware"),
      t("baby-and-toddler-items"),
      t("gardening-supplies"),
      t("party-supplies"),
      t("travel-accessories"),
      t("craft-and-hobby-supplies"),
      t("other"),
    ];
  }

  function getPaymentMethods() {
    return [
      t("cash"),
      t("credit-card"),
      t("debit-card"),
      t("bank-transfer"),
      t("mobile-wallet"),
      t("paypal"),
      t("online-banking"),
      t("cheque"),
      t("cryptocurrency"),
      t("other"),
    ];
  }

  const handleCloseDialog = () => {
    handleClose();
  };

  useMemo(() => {
    if (departmentId) {
      getSuppliers(departmentId)
        .then((data) => {
          if (data) {
            setSuppliers(data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId]);

  useEffect(() => {
    supabase
      .from("TVA")
      .select("uid, name, value")
      .eq("department_id", departmentId)
      .then(({ data, error }) => {
        if (error) {
          console.log("error: ", error);
          return;
        }
        if (data) {
          setTvaList(
            data.map((tva) => ({
              uid: tva.uid,
              name: tva.name,
            }))
          );
          setTvaListValue(
            data.map((tva) => ({ uid: tva.uid, value: tva.value }))
          );
        }
      });
  }, [supabase, departmentId]);

  useEffect(() => {
    supabase
      .channel("realtime:supplier")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Supplier" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSuppliers((prevData: any[]) => [...prevData, payload.new]);
          }
        }
      )
      .subscribe();
    () => {
      supabase.channel("realtime:supplier").unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    setSupplierNames(suppliers.map((supplier: any) => supplier.email));
  }, [suppliers]);

  const onSelectSupplier = (value: any) => {
    if (!value) {
      setNewProduct({ ...newProduct, ["supplier_id"]: null });
      return;
    }
    suppliers.forEach((supplier: any) => {
      if (supplier.email == value) {
        setNewProduct({ ...newProduct, ["supplier_id"]: supplier.uid });
      }
    });
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (
      name == "sell_price" ||
      name == "buy_price" ||
      name == "quantity" ||
      name == "stock_limit_for_alert" ||
      name == "desired_stock"
    ) {
      setNewProduct((prevState) => ({
        ...prevState,
        [name]: parseFloat(value) || 0,
      }));
      return;
    } else if (
      name === "entry_date" ||
      name === "exit_date" ||
      name === "expiration_date"
    ) {
      setNewProduct((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
      return;
    }
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onPaymentMethodChange = (value: string | null) => {
    setNewProduct((prevState) => ({
      ...prevState,
      ["payment_method"]: value || "",
    }));
  };

  const onProductFamilyChange = (value: string | null) => {
    setNewProduct((prevState) => ({
      ...prevState,
      ["nature_of_product"]: value || "",
    }));
  };

  const onBuyTvaChange = (value: any) => {
    setNewProduct((prevState: any) => ({
      ...prevState,
      ["buy_tva"]: value ? value.uid : null,
    }));
  };

  const onSellTvaChange = (value: any) => {
    setNewProduct((prevState: any) => ({
      ...prevState,
      ["sell_tva"]: value ? value.uid : null,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = ProductSchema.safeParse(newProduct);
    if (returnvalue.success) {
      const allData = { ...newProduct, department_id: departmentId };
      try {
        let imgUrl;
        if (imgFile) {
          const uploadData = await uploadProductImage(imgFile);
          imgUrl = uploadData.data?.publicUrl;
        }
        const { data, error } = await supabase
          .from("Product")
          .insert([
            {
              ...allData,
              image: imgUrl,
              entry_date: allData.entry_date.toISOString(),
              exit_date: allData.exit_date.toISOString(),
              expiration_date: allData.expiration_date.toISOString(),
            },
          ])
          .select();
        if (error) {
          if (error?.code == "23505") {
            toast.error("Product already exists");
          } else {
            toast.error("Error creating product");
          }
          console.log("error: ", error);
          handleCloseDialog();
          return;
        } else {
          toast.success("Product created successfully");
        }
        setNewProduct({
          name: "",
          quantity: 0.0,
          sell_price: 0.0,
          buy_price: 0.0,
          supplier_id: null,
          entry_date: new Date(),
          exit_date: new Date(),
          expiration_date: new Date(),
          payment_method: "",
          weight: 0.0,
          length: 0.0,
          width: 0.0,
          height: 0.0,
          area: 0.0,
          volume: 0.0,
          country_of_origin: "",
          state_province_of_origin: "",
          serial_number: "",
          stock_limit_for_alert: 0,
          desired_stock: 0,
          nature_of_product: "",
          notes: "",
          buy_tva: null,
          sell_tva: null,
        });
        setErrors({});
      } catch (error) {
        toast.error("Error creating product");
      }
      handleCloseDialog();
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
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
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "space-between",
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
              }}
            >
              {t("create-new-product")}
            </Typography>
            <CustumButton label={"Save"} onClick={onSubmit} />
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid
            container
            sx={{ width: "30rem", height: "35rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
              <TextField
                sx={{ width: 0, height: 0, opacity: 0 }}
                select
              ></TextField>
              <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                <AddProductImage setImgFile={setImgFile} />
              </Box>
              <TextField
                focused={true}
                margin="dense"
                label={t("lable")}
                type="text"
                fullWidth
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
              {errors.name && <FormError error={errors.name} />}
              <TextField
                margin="dense"
                label={t("serial-number")}
                type="text"
                fullWidth
                name="serial_number"
                value={newProduct.serial_number}
                onChange={handleInputChange}
              />
              {errors.serial_number && (
                <FormError error={errors.serial_number} />
              )}
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Box width={"100%"}>
                  <TabSelect
                    required={false}
                    itemsList={supplierNames}
                    onSelect={onSelectSupplier}
                    label={t("supplier")}
                  />
                </Box>
                <CreateSupplier showText={false} />
              </Box>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("quantity")}
                    type="text"
                    fullWidth
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                  />
                  {errors.quantity && <FormError error={errors.quantity} />}
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
                    label={t("buy-price")}
                    type="text"
                    name="buy_price"
                    fullWidth
                    value={newProduct.buy_price}
                    onChange={handleInputChange}
                  />
                  {errors.buy_price && <FormError error={errors.buy_price} />}
                </Box>
                <Grid
                  container
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Grid item xs={7}>
                    <MyTabSelect
                      label="Buy Tva"
                      itemsList={tvaList}
                      onSelect={onBuyTvaChange}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography ml={1}>
                      TTC:{" "}
                      {calcTTC(
                        newProduct.buy_price,
                        tvaListValue.find(
                          (tva) => tva.uid == newProduct.buy_tva
                        )?.value || 0
                      )}
                      €
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("sell-price")}
                    type="text"
                    name="sell_price"
                    fullWidth
                    value={newProduct.sell_price}
                    onChange={handleInputChange}
                  />
                  {errors.sell_price && <FormError error={errors.sell_price} />}
                </Box>
                <Grid
                  container
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Grid item xs={7}>
                    <MyTabSelect
                      required={false}
                      label="Sell Tva"
                      itemsList={tvaList}
                      onSelect={onSellTvaChange}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography ml={1}>
                      TTC:{" "}
                      {calcTTC(
                        newProduct.sell_price,
                        tvaListValue.find(
                          (tva) => tva.uid == newProduct.sell_tva
                        )?.value || 0
                      )}
                      €
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box
                display={"flex"}
                gap={"1rem"}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("entry-date")}
                    type="date"
                    name="entry_date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleInputChange}
                  />
                  {errors.entry_date && <FormError error={errors.entry_date} />}
                </Box>
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("exit-date")}
                    type="date"
                    name="exit_date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleInputChange}
                  />
                  {errors.exit_date && <FormError error={errors.exit_date} />}
                </Box>
              </Box>
              <TextField
                margin="dense"
                label={t("experation-date")}
                type="date"
                fullWidth
                name="expiration_date"
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {errors.expiration_date && (
                <FormError error={errors.expiration_date} />
              )}
              <TabSelect
                required={false}
                itemsList={getPaymentMethods()}
                onSelect={onPaymentMethodChange}
                label={t("payment-method")}
              />
              {errors.payment_method && (
                <FormError error={errors.payment_method} />
              )}

              <ProductDetails
                newProductData={newProduct}
                setNewProductData={setNewProduct}
                ProductErrors={errors}
              />
              <TextField
                margin="dense"
                label={t("stock-limit-for-alert")}
                type="text"
                fullWidth
                required={false}
                name="stock_limit_for_alert"
                value={newProduct.stock_limit_for_alert}
                onChange={handleInputChange}
              />
              {errors.stock_limit_for_alert && (
                <FormError error={errors.stock_limit_for_alert} />
              )}
              <TextField
                margin="dense"
                label={t("desired-stock")}
                type="text"
                fullWidth
                name="desired_stock"
                required={false}
                value={newProduct.desired_stock}
                onChange={handleInputChange}
              />
              {errors.desired_stock && (
                <FormError error={errors.desired_stock} />
              )}
              <TabSelect
                required={false}
                itemsList={getProductFamilies()}
                onSelect={onProductFamilyChange}
                label={t("product-family")}
              />
              {errors.nature_of_product && (
                <FormError error={errors.nature_of_product} />
              )}
              <TextField
                margin="dense"
                label={t("notes")}
                type="text"
                fullWidth
                name="notes"
                required={false}
                value={newProduct.notes}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
              {errors.notes && <FormError error={errors.notes} />}
            </Grid>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"flex-end"}
              gap={".3rem"}
              sx={{ py: ".6rem" }}
            >
              <CustumButton label={t("cancel")} onClick={handleCloseDialog} />
              <CustumButton label={"save"} onClick={onSubmit} />
            </Box>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
