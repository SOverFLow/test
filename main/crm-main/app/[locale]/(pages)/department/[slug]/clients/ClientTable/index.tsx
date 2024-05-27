"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Theme,
  styled,
} from "@mui/material";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserClient } from "../utils/types";
import DeleteClient from "../DeleteClient";
import EditClient from "../EditClient";
import Link from "next/link";
import { useTranslations } from "next-intl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import fetchBienData from "../utils/fetchContarctBienData";
const ImageMenuItem = styled(MenuItem)`
  img {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function MultipleSelectPlaceholder({
  clientId,
  table,
}: {
  clientId: any;
  table: "Bien" | "Contract";
}) {
  const [bienData, setBienData] = useState<string[]>([table]);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("client");

  useEffect(() => {
    if (!clientId) return;
    startTransition(async () => {
      const getBienData = await fetchBienData(clientId, table);
      // console.log("fd", getBienData, table);
      setBienData(() => [table, ...getBienData]);
    });
  }, [clientId, table, setBienData]);

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        displayEmpty
        input={<OutlinedInput />}
        defaultValue={t("click-to-see-all")}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
        renderValue={() => {
          return (
            <Grid item xs={12}>
                {t("click-to-see-all")}
            </Grid>
          );
        }}
      >
        {bienData.map((name) => {
          let index = 0;
          if (name === table) index = 1;
          return (
            <MenuItem
              key={name}
              value={name}
              disabled={index === 1 ? true : false}
            >
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default function ClientTable({
  clientData,
}: {
  clientData: UserClient[];
}) {
  const [rowsData, setRowsData] = useState(
    clientData.map((client) => ({
      id: client.uid,
      col2: [client.uid, client.avatar ?? "/images/profile.png"],
      col4: client.first_name,
      col5: client.last_name,
      col6: client.email,
      col3: client.phone,
      col7: client.status,
      col9: client.uid,
      col10: client.uid,
      col11: client.uid,
    }))
  );
  const t = useTranslations("client");

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "col2",
        headerName: t("picture"),
        width: 150,
        renderCell: (params: any) => (
          <ImageMenuItem>
            <Link href={`user/${params.value[0]}`}>
              <Image
                src={`${params.value[1]}`}
                width={40}
                height={40}
                alt={params.value}
                loading="lazy"
              />
            </Link>
          </ImageMenuItem>
        ),
      },
      { field: "col4", headerName: t("first-name"), width: 150 },
      { field: "col5", headerName: t("last-name"), width: 150 },
      { field: "col6", headerName: "Email", width: 150 },
      { field: "col3", headerName: t("phone"), width: 150 },
      { field: "col7", headerName: "Status", width: 150 },
      {
        field: "col10",
        headerName: "Contract",
        width: 250,
        renderCell: (params: any) => (
          <MultipleSelectPlaceholder
            clientId={params.value}
            table={"Contract"}
          />
        ),
      },
      {
        field: "col11",
        headerName: "Bien",
        width: 250,
        renderCell: (params: any) => (
          <MultipleSelectPlaceholder clientId={params.value} table={"Bien"} />
        ),
      },
      {
        field: "col9",
        headerName: "Action",
        width: 150,
        renderCell: (params: any) => (
          <>
            <EditClient clientId={params.value as string} />
            <DeleteClient ClientId={params.value as string} />
          </>
        ),
      },
    ],
    [t]
  );
  const supabase = createClient();
  useEffect(() => {
    const clientChanel = supabase
      .channel("clientChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Client" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setRowsData((prevData) => {
              return prevData.filter((row) => row.id !== payload.old.uid);
            });
          } else if (payload.eventType === "INSERT") {
            setRowsData((prevData) => [
              ...prevData,
              {
                id: payload.new.uid,
                col2: [
                  payload.new.uid,
                  payload.new.avatar ?? "/images/profile.png",
                ],
                col3: payload.new.phone,
                col4: payload.new.first_name,
                col5: payload.new.last_name,
                col6: payload.new.email,
                col7: payload.new.status,
                col9: payload.new.uid,
                col10: payload.new.uid,
                col11: payload.new.uid,
              },
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRowsData((prevData) => {
              return prevData.map((row) => {
                if (row.id === payload.new.uid) {
                  return {
                    id: payload.new.uid,
                    col2: [
                      payload.new.uid,
                      payload.new.avatar ?? "/images/profile.png",
                    ],
                    col3: payload.new.phone,
                    col4: payload.new.first_name,
                    col5: payload.new.last_name,
                    col6: payload.new.email,
                    col7: payload.new.status,
                    col9: payload.new.uid,
                    col10: payload.new.uid,
                    col11: payload.new.uid,
                  };
                }
                return row;
              });
            });
          }
        }
      )
      .subscribe();
    return () => {
      clientChanel.unsubscribe();
    };
  });

  return (
    <Box mt={1.5} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        rowHeight={40}
        sx={{
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
    </Box>
  );
}
