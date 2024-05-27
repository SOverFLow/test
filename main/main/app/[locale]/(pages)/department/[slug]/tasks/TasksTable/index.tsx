"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridPaginationModel,
  GridCallbackDetails,
} from "@mui/x-data-grid";
import { Box, useTheme, Theme, Typography } from "@mui/material";

// Custom components
import { Task } from "../utils/types";
import formatDate from "@/utils/formatDate";
import StyledChip from "@/components/ui/StyledChip";
import { useEffect, useState } from "react";
import {
  ClientFetchTasksLazy,
  fetchTotalTasksCount,
} from "../utils/fetchClientTasks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MoreMenu from "../components/MoreMenu";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";

function CheckBox({ value }: { value: boolean }) {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {value ? (
        <Typography fontSize={".9rem"} color={"green"}>Confirmed</Typography>
      ) : (
        <Typography fontSize={".9rem"} color={"red"}>Not confirmed</Typography>
      )}
    </Box>
  );
}

const Priority = ({ value }: { value: string }) => {
  const defaultTheme = useTheme();
  return (
    <StyledChip
      variant="filled"
      size="small"
      label={value}
      customcolor={
        value === "low"
          ? defaultTheme.palette.success
          : value === "medium"
            ? defaultTheme.palette.warning
            : defaultTheme.palette.error
      }
      sx={{marginX: "auto"}}
    />
  );
};


export default function TasksTable({
  initialTasksData,
}: {
  initialTasksData: Task[];
}) {
  const supabase = createClient();
  const t = useTranslations("task");
  const columns: GridColDef[] = [
    { field: "col1", headerName: t('title'), width: 200 },
    { field: "col2", headerName: `${t('costs-price')}($)`, width: 100 },
    { field: "col21", headerName: `${t('selling-price')} ($)`, width: 120 },
    { field: "col22", headerName: `${t('profit')} ($)`, width: 100 },
    { field: "col3", headerName: t('worker'), width: 150 },
    { field: "col4", headerName: t('client'), width: 150 },
    { field: "col5", headerName: t('adress'), width: 200 },
    { field: "col6", headerName: t('start-date'), width: 150 },
    { field: "col7", headerName: t('end-date'), width: 150 },
    { field: "col8", headerName: t('status'), width: 150 },
    {
      field: "col9",
      headerName: t('priority'),
      width: 100,
      renderCell: (params: any) => <Priority value={params.value} />,
    },
    {
      field: "col10",
      headerName: t('confirmed'),
      width: 150,
      renderCell: (params: any) => <CheckBox value={params.value} />,
    },
    {
      field: "col11",
      headerName: "...",
      width: 50,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => <MoreMenu taskId={params.value} />,
    },
  ];
  const department_id = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const userRole = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  )!;
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [pageData, setPageData] = useState<GridRowsProp>(
    initialTasksData.map((task) => {
      return {
        id: task.uid,
        col1: task.title,
        col2: task.cost,
        col21: task.selling_price || 0,
        col22: task.profit || 0,
        col3: task.Workers[0]
          ? task.Workers[0].first_name + " " + task.Workers[0].last_name
          : t('no-worker'),
        col4: task.Client
          ? task.Client.first_name + " " + task.Client.last_name
          : t('no-client'),
        col5: task.address,
        col6: formatDate(new Date(task.start_date)),
        col7: formatDate(new Date(task.end_date)),
        col8: task.status,
        col9: task.priority || t('no-priority'),
        col10: task.confirmed,
        col11: task.uid,
      };
    })
  );

  useEffect(() => {
    const subapaseTask = supabase
    .channel("realtime:task")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Task" },
      async (payload) => {
        if (payload.eventType === "DELETE") {
          setPageData((prevTasks) =>
            prevTasks.filter((task) => task.id !== payload.old.uid)
          );
        } else if (payload.eventType === "INSERT") {
          const newTask = {
              id: payload.new.uid,
              col1: payload.new.title,
              col2: payload.new.cost,
              col21: payload.new.selling_price || 0,
              col22: payload.new.profit || 0,
              col3: "_",
              col4: "_",
              col5: payload.new.address,
              col6: formatDate(new Date(payload.new.start_date)),
              col7: formatDate(new Date(payload.new.end_date)),
              col8: payload.new.status,
              col9: payload.new.priority || t('no-priority'),
              col10: payload.new.confirmed,
              col11: payload.new.uid,
            }
          newTask && setPageData((prevTasks) => [newTask, ...prevTasks]);
        }
      }
    )
    .subscribe();
    return () => {
      subapaseTask.unsubscribe();
    };
  }, [supabase, t]);

  useEffect(() => {
    department_id &&
      fetchTotalTasksCount(department_id).then((count) => {
        count && setRowCount(count);
      });
  }, [department_id]);

  const handlePageChange = async (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => {
    setLoading(true);
    ClientFetchTasksLazy(
      department_id,
      model.pageSize,
      model.page,
      userRole
    ).then((newTasksData) => {
      newTasksData &&
        setPageData(
          newTasksData.map((task) => {
            return {
              id: task.uid,
              col1: task.title,
              col2: task.cost,
              col21: task.selling_price || 0,
              col22: task.profit || 0,
              col3: task.Workers[0]
                ? task.Workers[0].first_name + " " + task.Workers[0].last_name
                : t('no-worker'),
              col4: task.Client
                ? task.Client.first_name + " " + task.Client.last_name
                : t('no-client'),
              col5: task.address,
              col6: formatDate(new Date(task.start_date)),
              col7: formatDate(new Date(task.end_date)),
              col8: task.status,
              col9: task.priority || t('no-priority'),
              col10: task.confirmed,
              col11: task.uid,
            };
          })
        );
      setLoading(false);
    });
  };

  return (
    <Box mt={3} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
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
