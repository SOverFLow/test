"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
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
import PhoneInput from "react-phone-input-2";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { getClientData } from "./utils";
import { EditClientSchema } from "@/utils/schemas/client/clientSchema";
import EditIcon from "@mui/icons-material/Edit";
import "react-phone-input-2/lib/material.css";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { InputDataClientEdit } from "../utils/formSchema";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import CreateBien from "../../biens/CreateBien";
import ContractServiceSelector from "../components/ContractServiceSelector";
import { getBiens } from "../utils/utils";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { createClient } from "@/utils/supabase/client";

interface EditClientProps {
  clientId: number | string;
}

export default function EditClient(props: EditClientProps) {
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchIndex, setFetchIndex] = useState(0);
  const [biens, setBiens] = useState<any>([]);
  const [bienNames, setBienNames] = useState<{ uid: string; name: string }[]>(
    []
  );
  const t = useTranslations("client");

  const [newClient, setNewClient] = useState<any>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    bien_id: null,
    service_id: null,
    contract_id: null,
  });

  useEffect(() => {
    const bienChannel = supabase
      .channel("realtime:bienChannel_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Bien" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBiens((prevBien: any) => [
              ...prevBien,
              {
                uid: payload.new.uid,
                name: payload.new.name,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      bienChannel.unsubscribe();
    };
  });

  useMemo(() => {
    if (fetchIndex) {
    }
    if (props.clientId) {
      getClientData(props.clientId)
        .then((data) => setNewClient(data))
        .catch((error) => console.error(error));
    }
  }, [props.clientId, fetchIndex]);

  useMemo(() => {
    if (departmentId) {
      getBiens(departmentId)
        .then((data) => {
          if (data) {
            setBiens(data ?? []);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId]);

  useEffect(() => {
    setBienNames(
      biens.map((bien: any) => ({ uid: bien.uid, name: bien.name }))
    );
  }, [biens]);

  const onSelectBien = (value: any | null) => {
    setNewClient({ ...newClient, bien_id: value ? value.uid : "" });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { name, value } = event.target;
    setNewClient((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = EditClientSchema.safeParse(newClient);
    if (returnvalue.success) {
      const allData = { ...newClient, user_id: props.clientId };
      try {
        await axios.put("/api/client", allData);
        toast.success(t("client-edited-successfully"), {
          position: "bottom-right",
        });
        setErrors({});
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let message =
            error.response?.status == 422
              ? t("a-client-already-exist-with-this-email")
              : t("an-unexpected-error-occurred");
          if (error.response?.status == 400) {
            message = t("a-client-already-exist-with-this-username");
          }

          toast.error(message, {
            position: "bottom-right",
          });
        } else {
          toast.error(t("an-unexpected-error-occurred"), {
            position: "bottom-right",
          });
        }
        setFetchIndex(Math.random());
      }

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

  return (
    <Box>
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
          title={t("edit-client")}
        >
          <EditIcon />
        </Button>
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
              {t("edit-client")}{" "}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container spacing={2} sx={{ width: "30rem" }}>
            {InputDataClientEdit().map((input, index) => (
              <Grid item xs={12 / input.fieldsPerRow} key={index}>
                {input.componentType === "text" && (
                  <TextField
                    margin="dense"
                    fullWidth
                    label={input.label}
                    type={input.type || "text"}
                    name={input.name}
                    variant="outlined"
                    value={newClient[input.name] || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                      required: input.isRequired,
                    }}
                  />
                )}
                {input.componentType === "phoneInput" && (
                  <PhoneInput
                    country={"fr"}
                    value={newClient.phone}
                    onChange={(phone: string) =>
                      handleInputChange({
                        target: { name: "phone", value: phone },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    inputStyle={{ width: "100%", margin: "4px 0px" }}
                    placeholder={t("enter-phone-number")}
                  />
                )}
                {input.componentType === "select" && (
                  <Box
                    display={"flex"}
                    gap={"1rem"}
                    sx={{ flexDirection: { xs: "column", md: "row" } }}
                  >
                    <Box width={"100%"}>
                      <CreateBien
                        canCreateClient={false}
                        // isFromEditClient
                        // ref={btnRef}
                        isOverride={true}
                        myClient={{
                          uid: props.clientId as string,
                          name:
                            newClient.first_name + " " + newClient.last_name,
                        }}
                      >
                        <Button
                          sx={{
                            fontSize: "0.9rem",
                            fontWeight: 550,
                            width: "100%",
                            py: "0.5rem",
                            textTransform: "none",
                            color: "#fff",
                            backgroundColor: theme.palette.primary.main,
                            // marginTop: "15px",
                          }}
                        >
                          add new bien
                        </Button>
                      </CreateBien>
                    </Box>
                  </Box>
                )}
                {errors[input.name] && <FormError error={errors[input.name]} />}
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} sx={{ width: "30rem", mt: "0.2rem" }}>
            <ContractServiceSelector setNewClientData={setNewClient} client_id={props.clientId as string} clientName={`${newClient.first_name} ${newClient.last_name}`}/>
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
        </DialogContent>
      </Dialog>
    </Box>
  );
}
