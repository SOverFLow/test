import { Priority } from "@/components/calendar/components/EventComponent";
import fetchInvoiceId from "@/components/calendar/utils/fetchInvoiceId";
import TaskTimeline from "@/components/ui/TaskTimeline";
import { Box, BoxProps, Button, Chip, Grid, Skeleton, Stack, Typography, styled } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

interface StyledPopupBoxProps extends BoxProps {
  backgroundColor?: string;
}

  const StyledPopupBox = styled(Box)<StyledPopupBoxProps>(({ theme, backgroundColor }) => ({
    border: 1,
    padding: 15,
    bgcolor: "#000",
    width: "auto",
    color: "#000",
    boxShadow: "0px 0px 1px 0px #000",
    backgroundColor: backgroundColor || "#e6e6e6", // Use the prop value or fallback to default

  }));

interface RelatedTask {
    worker_name: string;
    client_name: string;
    address: string;
    uid: string;
    start_date: string,
    end_date: string,
    title: string;
    priority: string;
  };

const CalendarPopUpForTask = ({ details,bgColor }: { details:RelatedTask, bgColor?:string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const t = useTranslations("taskpopup");

    const handleRedirect = useCallback(
        (url: string) => {
          startTransition(async () => {
            if (url != "../devis") {
              router.push(url);
              return;
            } else {
              const invoiceId = await fetchInvoiceId(details.uid);
              if (invoiceId) {
                router.push(`../devis/${invoiceId}`);
                return;
              } else {
                console.log("Devis not found");
                router.push(`../devis`);
              }
            }
          });
        },
        [router,details?.uid]
      );
  
    const buttonGridTobeShown = useMemo(
        () => [
          {
            content: t('task-details'),
            url: `../tasks/${details?.uid}`,
            redirect: handleRedirect,
          },
          {
            content: t('view-related-tasks'),
            url: `${details?.uid}`,
            redirect: handleRedirect,
          },
          {
            content: t('generate-devis'),
            url: "../devis",
            redirect: handleRedirect,
          },
        ],
        [t,details?.uid, handleRedirect]
      );
  
      const typoGridTobeShown = useMemo(
        () => [
          {
            content: t('worker-name'),
            value: details?.worker_name,
          },
          {
            content: t('client-name'),
            value: details?.client_name,
          },
          {
            content: t('bien-address'),
            value: details?.address,
          },
        ],
        [t,details]
      );

  return (
          <StyledPopupBox backgroundColor={bgColor} >
            <Grid container rowGap={1}>
              <Grid item xs={12}>
                <Box display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                  <Grid item xs={9}>
                    <Typography variant="h5">{details?.title}</Typography>
                  </Grid>
                  <Grid item xs={3} display={"flex"} justifyContent={"end"}>
                    <Priority value={details?.priority} />
                    </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} mt={".4rem"}>
                <TaskTimeline
                  start_date={details?.start_date}
                  end_date={details?.end_date}
                />
              </Grid>
              <Grid
                container
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                padding={2}
                rowGap={1}
              >
                <Grid item xs={12}>
                  {typoGridTobeShown.map((obj, index) => (
                    <Grid item xs={12} display={"flex"} key={index}>
                      <Grid item xs={4}>
                        <Typography>
                          <b>{obj.content}</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>
                          {obj.value && obj.value != " " ? (
                            <>
                              <b>:</b> {obj.value}
                            </>
                          ) : (
                            <Skeleton />
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid
                container
                display={"flex"}
                justifyContent={"space-around"}
                rowGap={1}
              >
                {buttonGridTobeShown.map((obj, index) => (
                  <Grid
                    key={index}
                    item
                    md={3.8}
                    xs={12}
                    display={"flex"}
                    justifyContent={"space-around"}
                  >
                    <Button
                      onClick={() => obj.redirect(obj.url)}
                      sx={{
                        p: "4px",
                        borderRadius: 2,
                        color: "#fff",
                        width: "100%",
                        textTransform: "none",
                      }}
                      disabled={isPending}
                    >
                      <Stack alignItems="center" direction="row">
                        <Typography fontSize={"16px"} fontWeight={""}>
                          {obj.content}
                        </Typography>
                      </Stack>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </StyledPopupBox>
  );
};

export default CalendarPopUpForTask;
