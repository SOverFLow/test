"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridPaginationModel,
  GridCallbackDetails,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Amortization } from "./utils/types";
import { createClient } from "@/utils/supabase/client";
import MoreMenu from "./MoreMenu";
import { payloadToAmortizationData } from "./utils/amortizationFormater";
import {
  ClientFetchAmortizationLazy,
  fetchTotalAmortizationCount,
} from "./utils/fetchClientAmortization";
import { useTranslations } from "next-intl";



export default function AmortizationTable({
  initialAmortizationData,
}: {
  initialAmortizationData: Amortization[];
}) {
  const supabase = createClient();
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [sModel, setSModel] = useState({ pageSize: 25, page: 0 });
  const t = useTranslations("Amortization");
  const [pageData, setPageData] = useState<GridRowsProp>(
    initialAmortizationData.map((amortization) =>
      payloadToAmortizationData(amortization)
    )
  );

  const columns: GridColDef[] = useMemo(()=>[
    { field: "col1", headerName: t('Accumulated-Depreciation'), width: 150 },
    { field: "col2", headerName: t('Acquisition-Date'), width: 150 },
    { field: "col3", headerName: t('Book-Value'), width: 150 },
    { field: "col4", headerName: t('Depreciation-Installment'), width: 150 },
    { field: "col5", headerName: t('First-Year-Useful-Life'), width: 150 },
    { field: "col6", headerName: t('Last-Year-Useful-Life'), width: 150 },
    { field: "col7", headerName: t('Net-Book'), width: 150 },
    { field: "col8", headerName: t('Number-Of-Years-Of-Depreciation'), width: 150 },
    { field: "col9", headerName: t('Start-Date-Of-The-Fiscal-Year'), width: 150 },
    { field: "col10", headerName: t('Value Of The Asset'), width: 150 },
    { field: "col11", headerName: t('Year'), width: 150 },
  
    {
      field: "col12",
      headerName: "",
      width: 20,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <MoreMenu amortizationData={params.value} />,
    },
  ] ,[t]);


  useEffect(() => {
    department_id &&
      fetchTotalAmortizationCount(department_id).then((count) => {
        count && setRowCount(count);
      });
  }, [department_id]);

  const handlePageChange = async (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => {
    setSModel(model);
    setLoading(true);
    ClientFetchAmortizationLazy(department_id, model.pageSize, model.page).then(
      (newAmortizationData) => {
        newAmortizationData &&
          setPageData(
            newAmortizationData.map((amortization) =>
              payloadToAmortizationData(amortization)
            )
          );
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const d = supabase
      .channel("realtime:amortization")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Amortization" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPageData((prevData) => [
              payloadToAmortizationData(payload.new),
              ...prevData,
            ]);
            setRowCount((prevCount) => prevCount + 1);
          } else if (payload.eventType === "UPDATE") {
            const updatedAmortization = payload.new;
            setPageData((prevData) =>
              prevData.map((amortization) => {
                if (amortization.id === updatedAmortization.uid) {
                  return payloadToAmortizationData(payload.new);
                }
                return amortization;
              })
            );
          } else if (payload.eventType === "DELETE") {
            const deletedAmortization = payload.old;
            setPageData((prevData) =>
              prevData.filter(
                (amortization) => amortization.id !== deletedAmortization.uid
              )
            );
            setRowCount((prevCount) => prevCount - 1);
          }
        }
      )
      .subscribe();
    () => {
      supabase.channel("realtime:amortization").unsubscribe();
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
          "& .MuiDataGrid-row": {
            bgcolor: (theme) => theme.palette.grey[100],
            "&:nth-of-type(even)": {
              bgcolor: (theme) => theme.palette.grey[300],
            },
            "&:hover": {
              bgcolor: (theme) => theme.palette.primary.light,
            },
          },
        }}
      />
    </Box>
  );
}
