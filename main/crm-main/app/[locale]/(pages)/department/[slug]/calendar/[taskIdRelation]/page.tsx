"use client";

import theme from "@/styles/theme";
import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import CalendarPopUpForTask from "./CalendarPopUpForTask";
import fetchTaskDetailsRelation from "./fetchTaskDetailsRelation";
import { useTranslations } from "next-intl";

const StyledPopupBox = styled(Box)<BoxProps>(({ theme }) => ({
  border: 1,
  padding: 1,
  bgcolor: "#000",
  width: "98%",
  color: "#000",
  backgroundColor: "#e6e6e6",
}));

function ResponsiveDivider() {
  const [ready, setReady] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  useEffect(() => {
    setReady(true);
  }, []);

  const dividerStyle = ready
    ? {
        backgroundColor: "#1a1918",
        width: matches ? "1px" : "100%",
        height: matches ? "100%" : "1px",
      }
    : {
        display: "none",
      };

  return <div style={dividerStyle} />;
}

interface RelatedTask {
  worker_name: string;
  client_name: string;
  address: string;
  uid: string;
  title: string;
  start_date: string;
  end_date: string;
  priority: string;
}

interface FetchedData {
  chosed_task: RelatedTask;
  related_tasks: RelatedTask[];
}

const Page = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { taskIdRelation } = useParams();
  const t = useTranslations('calendar');
  const [dataFetched, setDataFetched] = useState<FetchedData>(
    {} as FetchedData
  );

  const handleRedirectToCalender = () => {
    startTransition(() => {
      router.push("../calendar");
      console.log("Redirect to calender");
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const data = await fetchTaskDetailsRelation(taskIdRelation as string);
      console.log(data);
      setDataFetched(data as FetchedData);
    });
  }, [taskIdRelation]);

  return (
      <Grid container gap={2} position={"relative"}>
        { isPending &&
          <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"center"}
          position={"absolute"}
          top={"50%"}
          left={"50%"}
        >
          <CircularProgress />
        </Grid>
        }
        <Grid item xs={12}>
          <Button
            aria-label="return to calender"
            variant="contained"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
              textTransform: "none",
            }}
            title="button"
            onClick={handleRedirectToCalender}
            disabled={isPending}
          >
            <Stack direction="row" alignItems={"center"} gap={1}>
              <ArrowBackIosNew fontSize="small" />
              <Typography>{t('back-to-calender')}</Typography>
            </Stack>
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            display={"flex"}
            justifyContent={"space-between"}
            rowGap={"16px"}
          >
            <Grid
              item
              xs={12}
              md={5.8}
              order={{ xs: 3, md: 1 }}
              sx={{
                overflowY: "auto",
                maxHeight: "calc(100dvh - 200px)",
                minHeight: "400px",
              }}
            >
              <Grid
                container
                display={"flex"}
                flexDirection={"column"}
                rowGap={2}
              >
                <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                  <Typography variant="h5">{t('related-tasks')}</Typography>
                </Grid>
                {dataFetched?.related_tasks?.length === 0 && (
                  <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                    <Typography variant="h6">{t('no-related-tasks-found')}</Typography>
                  </Grid>
                )}
                {!isPending && dataFetched?.related_tasks?.map((task, index) => (
                  <Grid key={index} item xs={12}>
                    <StyledPopupBox>
                      <CalendarPopUpForTask details={task} bgColor="#f7cac3"/>
                    </StyledPopupBox>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={0.1}
              order={{ xs: 2, md: 2 }}
              display={"flex"}
              justifyContent={"center"}
            >
              {isPending ? null : <ResponsiveDivider />}
            </Grid>
            <Grid item xs={12} md={5.8} order={{ xs: 1, md: 3 }}>
              <Grid
                container
                display={"flex"}
                flexDirection={"column"}
                rowGap={2}
              >
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  height={"10px"}
                >
                  <Typography variant="h5" sx={{ padding: 0, margin: 0 }}>
                    {t('task-chosen')}
                  </Typography>
                </Grid>
                <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                  {!isPending && dataFetched?.chosed_task && dataFetched?.chosed_task.title && dataFetched?.chosed_task ? (
                    <StyledPopupBox>
                      <CalendarPopUpForTask
                        details={dataFetched?.chosed_task}
                        bgColor="#c3f2f7"
                      />
                    </StyledPopupBox>
                  ) :  
                  dataFetched?.chosed_task && !dataFetched?.chosed_task?.title ? (
                    <Typography variant="h6">{t('no-task-chosen')}</Typography>
                  )
                  : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default Page;
