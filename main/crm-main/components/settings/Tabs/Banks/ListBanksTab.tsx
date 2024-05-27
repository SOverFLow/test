"use client";
import { Box, Grid, Switch, Theme } from "@mui/material";
// import BanksTable from "./BanksTable";
import { useEffect, useState, useTransition } from "react";
import fetchBanks from "@/app/api/settings/actions/fetch_banks";
import { TabParagraph } from "../../Items/TabParagraph";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import DeleteBank from "./DeleteBank";
import updateBankStatus from "@/app/api/settings/actions/update_bank_status";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function ListBanksTab() {
  const t = useTranslations("SettingsPage.BankTab");
  const [isPending, startTransition] = useTransition();
  const [banksData, setbanksData] = useState<any>([]);
  const [rowsData, setRowsData] = useState<any>([]);
  const [isActiveBankSwitch, setIsActiveBankSwitch] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  // const [isPending2, startTransition2] = useTransition();
  const [activeBank, setActiveBank] = useState<{
    uid: string;
    created_at: string;
    updated_at: string;
    id: number;
    user_id: string;
    label: string;
    bank_name: string;
    currency: string;
    country: string;
    account_number: string;
    iban_number: string;
    bic_swift_code: string;
    bank_address: string;
    account_owner_name: string;
    account_owner_address: string;
    is_active: boolean;
  }>({
    uid: "",
    created_at: "",
    updated_at: "",
    id: 0,
    user_id: "",
    label: "",
    bank_name: "",
    currency: "",
    country: "",
    account_number: "",
    iban_number: "",
    bic_swift_code: "",
    bank_address: "",
    account_owner_name: "",
    account_owner_address: "",
    is_active: false,
  });
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const columns: GridColDef[] = [
    { field: "col1", headerName: t("label2"), width: 150 },
    { field: "col2", headerName: t("bank-name"), width: 150 },
    { field: "col3", headerName: t("account-number"), width: 150 },
    { field: "col4", headerName: t("iban-number"), width: 150 },
    { field: "col5", headerName: t("bic-swift-code"), width: 150 },
    { field: "col6", headerName: t("account-owner-name"), width: 150 },
    {
      field: "col7",
      headerName: t("status"),
      width: 150,
      renderCell: (params: any) => (
        <>
          <Switch
            {...label}
            checked={params.value.is_active}
            onChange={(e) => {
              // console.log(params.value);
              startTransition(() => {
                updateBankStatus(params.value.uid, activeBank?.uid).then(
                  (data) => {
                    if (data?.error) {
                      console.error(data.error);
                    } else {
                      // console.log(data.success);
                      //  console.log(data.success);
                      // console.log("params.value.uid", params.value.uid);
                      // console.log("activeBank?.uid", activeBank?.uid);
                      for (let i = 0; i < banksData.length; i++) {
                        if (
                          banksData[i].uid === params.value.uid &&
                          banksData[i].is_active === false
                        ) {
                          banksData[i].is_active = true;
                        } else {
                          banksData[i].is_active = false;
                        }
                      }
                      setRowsData(
                        banksData?.map((bank: any) => ({
                          id: bank.uid,
                          col1: bank.label,
                          col2: bank.bank_name,
                          col3: bank.account_number,
                          col4: bank.iban_number,
                          col5: bank.bic_swift_code,
                          col6: bank.account_owner_name,
                          col7: bank,
                          col8: bank.uid,
                        })) || []
                      );
                      setActiveBank(params.value);
                    }
                  }
                );
              });
            }}
          />
        </>
      ),
    },
    {
      field: "col8",
      headerName: t("action"),
      width: 200,
      renderCell: (params: any) => (
        <>
          {/* <EditBank BankId={params.value as string} /> */}
          <DeleteBank bankId={params.value as string} />
        </>
      ),
    },
  ];
  useEffect(() => {
    async function getProfile() {
      startTransition(() => {
        fetchBanks().then((data: any) => {
          if (data?.error) {
            // setErrors(data.error);
            console.error(data.error);
          } else {
            // console.log(data.data);
            // setbanksData(data.data);
            const activeBankTmp: any = data.data?.find(
              (bank: any) => bank.is_active
            );
            setActiveBank(activeBankTmp);
            setbanksData(data.data);
            setRowsData(
              data.data?.map((bank: any) => ({
                id: bank.uid,
                col1: bank.label,
                col2: bank.bank_name,
                col3: bank.account_number,
                col4: bank.iban_number,
                col5: bank.bic_swift_code,
                col6: bank.account_owner_name,
                col7: bank,
                col8: bank.uid,
              })) || []
            );
          }
        });
      });
    }
    getProfile();
  }, []);

  const supabase = createClient();
  useEffect(() => {
    const BankChanel = supabase
      .channel("realtime:BankChanel2")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bank",
          // filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          console.log("payload", payload);
          if (payload.eventType === "DELETE") {
            setRowsData((prevData: any) => {
              console.log("deleted row", payload.old);
              setbanksData((prevData: any) => {
                return prevData.filter(
                  (row: any) => row.uid !== payload.old.uid
                );
              });
              return prevData.filter((row: any) => row.id !== payload.old.uid);
            });
          }
          // else if (payload.eventType === "INSERT") {
          //   console.log("inserted row", payload.new);
          //   setRowsData((prevData: any) => [
          //     ...prevData,
          //     {
          //       id: payload.new.uid,
          //       col1: payload.new.label,
          //       col2: payload.new.bank_name,
          //       col3: payload.new.account_number,
          //       col4: payload.new.iban_number,
          //       col5: payload.new.bic_swift_code,
          //       col6: payload.new.account_owner_name,
          //       col7: payload.new,
          //       col8: payload.new.uid,
          //     },
          //   ]);
          // } else if (payload.eventType === "UPDATE") {
          //   setRowsData((prevData: any) => {
          //     return prevData.map((row: any) => {
          //       if (row.id === payload.new.uid) {
          //         return {
          //           id: payload.new.uid,
          //           col1: payload.new.label,
          //           col2: payload.new.bank_name,
          //           col3: payload.new.account_number,
          //           col4: payload.new.iban_number,
          //           col5: payload.new.bic_swift_code,
          //           col6: payload.new.account_owner_name,
          //           col7: payload.new,
          //           col8: payload.new.uid,
          //         };
          //       }
          //       return row;
          //     });
          //   });
          // }
        }
      )
      .subscribe();
    return () => {
      BankChanel.unsubscribe();
    };
  }, [departmentId, supabase]);

  return (
    <Grid justifyContent={"center"}>
      <Grid item xs={11}>
        <TabParagraph sx={{ mx: 1, mb: 2, width: "100%" }}>
          {t("list-of-banks")}
        </TabParagraph>
        <DataGrid
          loading={isPending}
          rows={rowsData}
          columns={columns}
          rowHeight={40}
          componentsProps={{
            pagination: {
              labelRowsPerPage: t("rows-per-page"),
            },
          }}
          sx={{
            mt: 1.3,
            height: "calc(90vh - 300px)",
            // overflow: "hidden",
            width: "100%",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: (theme: Theme) => theme.palette.primary.dark,
              color: (theme: Theme) => theme.palette.grey[100],
            },
            "& .MuiDataGrid-row": {
              bgcolor: (theme: Theme) => theme.palette.grey[100],
              "&:nth-of-type(even)": {
                bgcolor: (theme: Theme) => theme.palette.grey[300],
              },
              "&:hover": {
                bgcolor: (theme: Theme) => theme.palette.primary.light,
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
