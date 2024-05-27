"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridPaginationModel,
  GridCallbackDetails,
  GridRowClassNameParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import {
  ClientFetchContactLazy,
  fetchTotalContactsCount,
} from "./utils/fetchClientContacts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Contact } from "./utils/types";
import { createClient } from "@/utils/supabase/client";
import MoreMenu from "./MoreMenu";
import { payloadToContactData } from "./utils/contactFormater";
import { useTranslations } from "next-intl";
import { blue, green, grey, red, yellow } from "@mui/material/colors";
import MultipleSelectPlaceholder from "./PlaceHolder";

export default function ContactsTable({
  initialContactsData,
}: {
  initialContactsData: Contact[];
}) {
  const supabase = createClient();
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [sModel, setSModel] = useState({ pageSize: 25, page: 0 });
  const t = useTranslations("Contact");
  const [pageData, setPageData] = useState<GridRowsProp>(
    initialContactsData.map((contact) => payloadToContactData(contact))
  );

  const columns: GridColDef[] = [
      { field: "col1", headerName: t("Full-Name"), width: 200 },
      { field: "col2", headerName: t("Email"), width: 200 },
      { field: "col3", headerName: t("Phone"), width: 200 },
      { field: "col4", headerName: t("Address"), width: 300 },
      { field: "col5", headerName: t("created-at"), width: 150 },
      {
        field: "col6",
        headerName: t("status"),
        width: 200,
        renderCell: (params) => {
          return (
              <MultipleSelectPlaceholder value={params.value}/>
          )
        },
      },
      {
        field: "col7",
        headerName: "...",
        width: 40,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => <MoreMenu contactData={params.value} />,
      },
    ]

  const getRowClassName = (params: GridRowClassNameParams<any>) => {
    switch (params.row.col6[0]) {
      case 'Validated':
        return 'status-validated';
      case 'Not interested':
        return 'status-not-interested';
      case 'Re-call':
        return 'status-re-call';
      case 'Not reachable':
        return 'status-not-reachable';
      case 'Not responding':
        return 'status-not-responding';
      default:
        return 'No status';
    }
  };

  useEffect(() => {
    department_id &&
      fetchTotalContactsCount(department_id).then((count) => {
        count && setRowCount(count);
      });
  }, [department_id]);

  const handlePageChange = async (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => {
    setSModel(model);
    setLoading(true);
    ClientFetchContactLazy(department_id, model.pageSize, model.page).then(
      (newContactsData) => {
        newContactsData &&
          setPageData(
            newContactsData.map((contact) => payloadToContactData(contact))
          );
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const d = supabase
      .channel("realtime:contacts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Contact" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPageData((prevData) => [
              payloadToContactData(payload.new),
              ...prevData,
            ]);
            setRowCount((prevCount) => prevCount + 1);
          } else if (payload.eventType === "UPDATE") {
            const updatedContact = payload.new;
            setPageData((prevData) =>
              prevData.map((contact) => {
                if (contact.id === updatedContact.uid) {
                  return payloadToContactData(payload.new);
                }
                return contact;
              })
            );
          } else if (payload.eventType === "DELETE") {
            const deletedContact = payload.old;
            setPageData((prevData) =>
              prevData.filter((contact) => contact.id !== deletedContact.uid)
            );
            setRowCount((prevCount) => prevCount - 1);
          }
        }
      )
      .subscribe();
    () => {
      supabase.channel("realtime:contacts").unsubscribe();
    };
  }, [supabase, sModel, department_id, setPageData, setLoading]);

  return (
    <Box mt={1.5} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={pageData}
        columns={columns}
        rowHeight={40}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        getRowClassName={getRowClassName} 
        pageSizeOptions={[25, 50, 100]}
        pagination
        paginationMode="server"
        onPaginationModelChange={handlePageChange}
        rowCount={rowCount}
        loading={loading}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: (theme) => theme.palette.primary.dark,
            color: (theme) => theme.palette.grey[100],
          },
          "& .status-validated, & .MuiDataGrid-row.status-validated.Mui-selected": {
            bgcolor: green[700],
            color: "white",
            "&:hover": {
              bgcolor: green[500],
            },
          },
          "& .status-not-interested, & .MuiDataGrid-row.status-not-interested.Mui-selected": {
            bgcolor: '#e0241b',
            color: "white",
            "&:hover": {
              bgcolor: red[500],
            },
          },
          "& .status-re-call, & .MuiDataGrid-row.status-re-call.Mui-selected": {
            bgcolor: yellow[700],
            color: "black",
            "&:hover": {
              bgcolor: yellow[600],
            },
          },
          "& .status-not-reachable, & .MuiDataGrid-row.status-not-reachable.Mui-selected": {
            bgcolor: '#0055AA',
            color: "white",
            "&:hover": {
              bgcolor: blue[500],
            },
          },
          "& .status-not-responding, & .MuiDataGrid-row.status-not-responding.Mui-selected": {
            bgcolor: grey[600],
            color: "white",
            "&:hover": {
              bgcolor: grey[500],
            },
          },
        }}
      />
    </Box>
  );
}
