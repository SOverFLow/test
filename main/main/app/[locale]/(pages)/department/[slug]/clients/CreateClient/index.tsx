"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import { RootState } from "@/store";
import axios from "axios";
import { AppBar, Box, Button, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { Dialog, DialogContent, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { clientSchema } from "@/utils/schemas/client/clientSchema";
import { nanoid } from "nanoid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import Close from "@mui/icons-material/Close";
import { getBiens } from "../utils/utils";
import TabSelect from "@/components/ui/TabSelect/TabSelect";
import theme from "@/styles/theme";
import ContractServiceSelector from "../components/ContractServiceSelector";
import CreateBien from "../../biens/CreateBien";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import InputDataClient from "../utils/formSchema";

interface props {
  openSteper?: () => void;
  isFromBien?: boolean;
  isDisabled?: boolean;
}

export default function CreateClient(props: props) {
  const supabase = createClient();
  const t = useTranslations("client");
  const isOpenFromBien = props.isFromBien ?? false;
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [bienNames, setBienNames] = useState<{ uid: string; name: string }[]>(
    []
  );
  // const [biens, setBiens] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [myClient, setMyClient] = useState<any>({});
  const [newClient, setNewClient] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    bien_id: null,
    service_id: null,
    contract_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const generatePassword = () => {
    setNewClient((prevState: any) => ({
      ...prevState,
      ["password"]: nanoid(12),
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newClient.password);
  };

  const handleCloseDialog = () => {
    props.openSteper && props.openSteper();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const bienChannel = supabase
      .channel("realtime:bienChannel_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Bien" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // console.log("==> payload.new: ", payload.new);
            if (payload.new.department_id !== departmentId) return;
            handleCloseDialog();
            // setBiens((prevBien: any) => [
            //   ...prevBien,
            //   {
            //     uid: payload.new.uid,
            //     name: payload.new.name,
            //   },
            // ]);
          }
        }
      )
      .subscribe();

    return () => {
      bienChannel.unsubscribe();
    };
  });
  // useMemo(() => {
  //   if (departmentId) {
  //     getBiens(departmentId)
  //       .then((data) => {
  //         if (data) {
  //           setBiens(data ?? []);
  //         }
  //       })
  //       .catch((error) => console.error(error));
  //   }
  // }, [departmentId]);

  // useEffect(() => {
  //   setBienNames(
  //     biens.map((bien: any) => ({ uid: bien.uid, name: bien.name }))
  //   );
  // }, [biens]);

  // const onSelectBien = (value: any | null) => {
  //   setNewClient({ ...newClient, bien_id: value ? value.uid : "" });
  // };

  const onSubmit = async (isOverride: boolean) => {
    const returnvalue = clientSchema.safeParse(newClient);
    if (returnvalue.success) {
      if (myClient.uid) {
        // if client is already created
        toast.warning("client is already created", {
          position: "bottom-right",
        });
        handleCloseDialog();
        return;
      }
      setIsLoading(true);
      const allData = { ...newClient, department_id: departmentId };
      // if (allData.service_id === null && allData.contract_id === null) {
      //   toast.error(t("please-select-a-service-or-a-contract-required"), {
      //     position: "bottom-right",
      //   });
      //   return;
      // }

      try {
        const res = await axios.post("/api/client", allData);
        if (res.status === 201) {
          // console.log("==> /api/client data: ", res.data);
          setMyClient({
            uid: res.data.message.postData.user.id,
            name: newClient.first_name + " " + newClient.last_name,
          });
        }
        toast.success(
          t("client-added-successfully-we-sent-an-email-to-this-client"),
          {
            position: "bottom-right",
          }
        );
        setIsLoading(false);
        setErrors({});
        if (!isOverride) {
          handleCloseDialog();
          setNewClient({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            service_id: "",
            contract_id: "",
            bien_id: "",
          });
        }
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
      }

      if (!isOverride) {
        handleCloseDialog();
      }
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
  const btnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (myClient.uid && btnRef.current) {
      btnRef.current.click();
    }
  }, [myClient.uid]);

  return (
    <Box>
      <Dialog open={true} onClose={handleCloseDialog} fullScreen>
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
              disabled={props.isDisabled}
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
                textAlign: "center",
                flex: 1,
              }}
            >
              {t("create-new-client")}{" "}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Grid container spacing={2} sx={{ width: "30rem" }}>
            {InputDataClient().map((input, index) => (
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

                {input.componentType === "password" && (
                  <Box width={"100%"}>
                    <TextField
                      autoFocus
                      margin="dense"
                      label={t("password")}
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      name="password"
                      value={newClient.password}
                      onChange={handleInputChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title={t("generate-password")}>
                              <IconButton onClick={generatePassword}>
                                <SyncLockIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("copy-password")}>
                              <IconButton onClick={handleCopyPassword}>
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              aria-label={t("toggle-password-visibility")}
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
                {input.componentType === "phoneInput" && (
                  <PhoneInput
                    specialLabel=""
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

                {input.componentType === "select" && !isOpenFromBien && (
                  <Box
                    display={"flex"}
                    gap={"1rem"}
                    sx={{ flexDirection: { xs: "column", md: "row" } }}
                  >
                    <Box width={"100%"}>
                      {myClient.uid ? (
                        <CreateBien
                          canCreateClient={false}
                          ref={btnRef}
                          isOverride={true}
                          myClient={{
                            uid: myClient.uid,
                            name: myClient.name,
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
                            {t('client-created-create-a-new-proprety')}
                          </Button>
                        </CreateBien>
                      ) : (
                        <Button
                          onClick={() => onSubmit(true)}
                          disabled={isLoading}
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
                          {t('save-client-and-create-a-new-proprety')}
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
                {errors[input.name] && <FormError error={errors[input.name]} />}
              </Grid>
            ))}
          </Grid>
          <Divider sx={{width:'28rem',m:'0.6rem'}}>{t('or')}</Divider>
          <Grid container spacing={2} sx={{ width: "30rem" }}>
            <Grid
              item
              xs={12}
              justifyContent={"end"}
              alignItems={"end"}
              display={"flex"}
              marginBottom={"1rem"}
            >
              <CustumButton
                label={t('create-client')}
                isDisabled={isLoading}
                onClick={() => {
                  onSubmit(false);
                }}
                style={{
                  width: "100%",
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
