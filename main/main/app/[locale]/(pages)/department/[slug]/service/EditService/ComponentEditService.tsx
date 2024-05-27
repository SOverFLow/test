"use client";
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { useZodService } from "@/schemas/zod/zod.contract";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AddCircleOutline, Close } from "@mui/icons-material";
import theme from "@/styles/theme";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { FormError } from "@/components/ui/FormError/FormError";
import { EditServiceServer, getService } from "./utils";
import { toast } from "react-toastify";
import { unitsData } from "../../utils/dataUnits";
import TabSelectForService from "@/components/ui/TabSelect/TabSelectForService";
import CreateTva from "../../tva/CreateTva";
import AddProductImage from "../../products/CreateProduct/AddProductImage";
import convertImageToWebP from "@/utils/webPconverter";
import { uploadServiceImage } from "../utils/createNewService";
import CreateFamily from "../utils/CreateFamily";

interface Service {
    uid?: string;
    image: string;
    title: string;
    family: string;
    buying_price_ht: number;
    selling_price_ht: number;
    tva: number;
    buying_price_ttc: number;
    selling_price_ttc: number;
    units: string;
    reference?: string;
    department_id?: string;
    created_at?: string;
    updated_at?: string;
  }

  interface EditServiceProps {
    serviceId: string;
    tvaList: any;
    setTvaList: any;
    familyList: any;
    setFamilyList: any;
    handleDialogState: () => void;
    dialogOpen: boolean;
  }

const ComponentEditService = ({handleDialogState,dialogOpen , serviceId,tvaList,setTvaList,familyList,setFamilyList }: EditServiceProps) => {

    const supabase = createClient();
  const ZodService = useZodService();
  const t = useTranslations("Service");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  
  const [service, setService] = useState<Service>({
    uid: "",
    image: "",
    title: "",
    family: "",
    buying_price_ht: 0,
    selling_price_ht: 0,
    tva: 0,
    buying_price_ttc: 0,
    selling_price_ttc: 0,
    units: "",
    reference: "",
    department_id: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    const tvaChannel = supabase
      .channel("realtime:aloha_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "TVA" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTvaList((prev:any) => [
              ...prev,
              {
                name: payload.new.name,
                value: payload.new.value,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      tvaChannel.unsubscribe();
    };
  });

  const onSelecTva = (value: any | null): void => {
    setService((prevState: Service) => ({
      ...prevState,
      tva: value ? Number(value.value) : 0,
      selling_price_ttc:Number(
        Number(prevState?.selling_price_ht ?? 0) +
        Number(
          ((prevState?.selling_price_ht ?? 0) *
            (value ? Number(value.value) : 0)) /
            100
        )),
      buying_price_ttc: Number(
        Number(prevState?.buying_price_ht ?? 0) +
        Number(
          ((prevState?.buying_price_ht ?? 0) *
            (value ? Number(value.value) : 0)) /
            100
        )),
    }));
  };

  const onSelectFamily = (value: any | null): void => {
    setService((prevState: any) => ({
      ...prevState,
      family: value ? value.name : "",
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setService((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getService(serviceId)
      .then((data) => {
        if (data) {
          setService(data);
        }
      })
      .catch((error) => console.error(error));
  }, [serviceId]);

  const onSubmit = async () => {
    const zodValidation = ZodService.safeParse(service);
    console.log("zodValidation =>", zodValidation);
    if (zodValidation.success) {
      try {
        startTransition(async () => {
          let imgUrl;
          if (imgFile) {
            const form = new FormData();
            const result = await convertImageToWebP(imgFile);
            form.append("file", result as File);
            const uploadData = await uploadServiceImage(form);
            imgUrl = uploadData.data?.publicUrl;
          }
        const error = await EditServiceServer(serviceId,{
          ...service,
          image: imgUrl ?? service.image,
        });
        if (error) {
          toast.error(t("An unexpected error occurred")),
            {
              position: "bottom-right",
            };
          return;
        }
        toast.success(t("Service Edited successfully")),
          {
            position: "bottom-right",
          };
        handleDialogState();
      });
      } catch (error) {
        toast.error(t("An unexpected error occurred")),
          {
            position: "bottom-right",
          };
        console.error(error);
      }
    } else {
      zodValidation.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          setErrors(acc);
          console.log("errors", acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };
    return (
        <Dialog
        open={dialogOpen}
        onClose={handleDialogState}
        autoFocus={true}
        fullScreen
      >
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
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDialogState}
              aria-label="close"
              sx={{ marginLeft: "1rem", position: "absolute", left: 0}}
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
              {t('update-service-informations')}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent autoFocus={true}>
          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: "60rem",
              mt: 6,
            }}
          >
            <Grid item xs={12}>
              <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                <AddProductImage setImgFile={setImgFile} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  gap: "1rem",
                }}
              >
                <EditSharpIcon
                  sx={{ fontSize: "2rem", color: theme.palette.primary.main }}
                />
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "550",
                    color: theme.palette.text.primary,
                  }}
                >
                  {t("Edit Service")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Title")}
                variant="outlined"
                name="title"
                value={service?.title}
                onChange={handleChange}
              />
              {errors.title && <FormError error={errors.title} />}
            </Grid>
            
              <Grid item xs={6}>
              <TextField
                type="number"
                fullWidth
                label={t('buying-price-ht')}
                variant="outlined"
                name="buying_price_ht"
                value={service?.buying_price_ht}
                onChange={(event) => {
                  setService((prevState: any) => ({
                    ...prevState,
                    buying_price_ht: Number(event.target.value),
                    buying_price_ttc: +(Number(
                      Number(event.target.value) +
                        (Number(event.target.value) * (service?.tva ?? 0)) / 100
                    ).toFixed(2)),
                  }));
                }}
              />
              {errors.buying_price_ht && (
                <FormError error={errors.buying_price_ht} />
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                fullWidth
                label={t('selling-price-ht')}
                variant="outlined"
                name="selling_price_ht"
                value={service?.selling_price_ht}
                onChange={(event) => {
                  setService((prevState: any) => ({
                    ...prevState,
                    selling_price_ht: Number(event.target.value),
                    selling_price_ttc: +(Number(
                      Number(event.target.value) +
                        (Number(event.target.value) * (service?.tva ?? 0)) / 100
                    ).toFixed(2)),
                  }));
                }}
              />
              {errors.selling_price_ht && (
                <FormError error={errors.selling_price_ht} />
              )}
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                gap="1rem"
              >
                <Box width="100%">
                  <TabSelectForService
                    defaultVal={service?.tva}
                    itemsList={tvaList}
                    onSelect={onSelecTva}
                    placeholder={t("select-tva")}
                  />
                </Box>
                <Box width="32%">
                  <CreateTva isOverride={true}>
                    <CustumButton
                      onClick={() => {}}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 550,
                        width: "100%",
                        textTransform: "none",
                        color: "#fff",
                        backgroundColor: theme.palette.primary.main,
                        maxHeight: "100%",
                      }}
                      label={
                        <>
                          <AddCircleOutline />

                          {t("add-tva")}
                        </>
                      }
                    />
                  </CreateTva>
                </Box>
              </Box>
              {errors.tva && <FormError error={errors.tva} />}
            </Grid>


              <Grid item xs={6}>
              <TextField
                type="number"
                fullWidth
                label={t('buying-price-ttc')}
                variant="outlined"
                name="buying_price_ttc"
                value={service?.buying_price_ttc}
                onChange={() => {}}
              />
              {errors.buying_price_ttc && (
                <FormError error={errors.buying_price_ttc} />
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                fullWidth
                label={t('selling-price-ttc')}
                variant="outlined"
                name="selling_price_ttc"
                value={service?.selling_price_ttc}
                onChange={() => {}}
              />
              {errors.selling_price_ttc && (
                <FormError error={errors.selling_price_ttc} />
              )}
            </Grid>


              <Grid item xs={12} md={12}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  {t("Units")}
                </InputLabel>
                <Select
                  displayEmpty
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={service?.units}
                  label={t("Units")}
                  onChange={(event) => {
                    setService((prevState: any) => ({
                      ...prevState,
                      units: event.target.value as string,
                    }));
                  }}
                >
                  {Object.keys(unitsData).map((unit: string) => {
                    return (
                      <MenuItem key={unit} value={unit}>
                        {unitsData[unit as keyof typeof unitsData]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {errors.units && <FormError error={errors.units} />}
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                gap="1rem"
              >
                <Box width="100%">
                  <TabSelectForService
                    defaultVal={service?.family}
                    itemsList={familyList}
                    onSelect={onSelectFamily}
                    placeholder={t('select-family-of-the-service')}
                    isFromFamily={true}
                  />
                </Box>
                <Box width="32%">
                  <CreateFamily isOverride={true} setFamilyList={setFamilyList}>
                    <CustumButton
                      onClick={() => {}}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 550,
                        width: "100%",
                        textTransform: "none",
                        color: "#fff",
                        backgroundColor: theme.palette.primary.main,
                        maxHeight: "2.3rem",
                      }}
                      label={
                        <>
                          <AddCircleOutline />
                          {t('add-new-family')}
                        </>
                      }
                      disabled={isPending}
                    />
                  </CreateFamily>
                </Box>
              </Box>
              {errors.family && <FormError error={errors.family} />}
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"end"}>
              <CustumButton label={t("Save")} onClick={onSubmit} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
}

export default ComponentEditService;