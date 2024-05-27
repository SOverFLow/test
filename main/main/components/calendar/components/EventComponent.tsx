import React, {
  TransitionStartFunction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  styled,
  BoxProps,
  Stack,
  Skeleton,
  useTheme,
} from "@mui/material";
import "../style/style.css";
import { lightenColor } from "./utils/utilsDesign";
import TaskTimeline from "@/components/ui/TaskTimeline";
import { useRouter } from "next/navigation";
import fetchInvoiceId from "../utils/fetchInvoiceId";
import fetchPopUpDetail from "../utils/fetchWorkerDetail";
import { useTranslations } from "next-intl";
import StyledChip from "@/components/ui/StyledChip";
import { Popover } from "antd";
import { Close } from "@mui/icons-material";

const StyledPopupBox = styled(Box)<BoxProps>(({ theme }) => ({
  border: 1,
  padding: 15,
  bgcolor: "#000",
  maxHeight: "400px",
  width: "auto",
  maxWidth: "600px",
  overflowY: "auto",
  color: "#000",
  backgroundColor: "#e6e6e6",
  boxShadow: "0px 0px 2px 0px #000",
}));

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
    />
  );
};

export { Priority };

const PopUpCustom = ({
  event,
  startTransition,
  isPending,
  details,
  hide,
}: {
  event: any;
  startTransition: TransitionStartFunction;
  isPending: boolean;
  details: any;
  hide: any;
}) => {
  const t = useTranslations("taskpopup");
  const router = useRouter();

  const handleRedirect = useCallback(
    (url: string) => {
      startTransition(async () => {
        if (url != "devis") {
          router.push(url);
          return;
        } else {
          const invoiceId = await fetchInvoiceId(event.id);
          if (invoiceId) {
            router.push(`devis/${invoiceId}`);
            return;
          } else {
            console.log("Devis not found");
            router.push(`devis`);
          }
        }
      });
    },
    [router, event.id, startTransition]
  );

  const buttonGridTobeShown = useMemo(
    () => [
      {
        content: t("task-details"),
        url: `tasks/${event.id}`,
        redirect: handleRedirect,
      },
      {
        content: t("view-related-tasks"),
        url: `calendar/${event.id}`,
        redirect: handleRedirect,
      },
      {
        content: t('generate-devis'),
        url: "devis",
        redirect: handleRedirect,
      },
    ],
    [t, event.id, handleRedirect]
  );

  const typoGridTobeShown = useMemo(
    () => [
      {
        content: t("worker-name"),
        value: details?.worker_name,
      },
      {
        content: t("client-name"),
        value: details?.client_name,
      },
      {
        content: t("bien-address"),
        value: details?.address,
      },
    ],
    [t, details]
  );

  return (
    <StyledPopupBox>
      <Grid container rowGap={1}>
        <Grid item xs={11.5} position={"relative"}>
          <Box display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
            <Grid item xs={9}>
              <Typography variant="h5">{event.title}</Typography>
            </Grid>
            <Grid item xs={3} display={"flex"} justifyContent={"end"}>
              <Priority value={details?.priority} />
            </Grid>
          </Box>
        </Grid>
        <Box
          onClick={hide}
          sx={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
        >
          <Close sx={{ color: "red" }} />
        </Box>

        <Grid item xs={12} mt={".4rem"}>
          <TaskTimeline start_date={event.start} end_date={event.end} />
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

const EventComponent = React.memo(({ event }: { event: any }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isPending, startTransition] = React.useTransition();
  const [details, setDetails] = useState<any>();
  const [open, setOpen] = useState(false);

  const togglePopup = (e: React.MouseEvent<HTMLElement>) => {
    console.log("Popup opening");
    e.preventDefault();
    e.stopPropagation();
    if (anchorEl) {
      setAnchorEl(null);
      return;
    }
    startTransition(async () => {
      const data = await fetchPopUpDetail(event.id);
      setDetails(data);
    });
    setAnchorEl(e.currentTarget);
  };

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <>
      <Popover
        content={
          <PopUpCustom
            event={event}
            startTransition={startTransition}
            isPending={isPending}
            details={details}
            hide={hide}
          />
        }
        trigger={"click"}
        overlayStyle={{ padding: "0 !important" }}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <div
          style={{
            backgroundColor: lightenColor(event.backgroundColor, 0.1),
            color: "white",
            borderRadius: "5px",
            padding: "0px 20px",
            height: "100%",
            width: "100%",
          }}
          onClick={togglePopup}
          className="eventComponent"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>{event.title}</strong>
          </div>
        </div>
      </Popover>
    </>
  );
});

EventComponent.displayName = "EventComponent";

export default EventComponent;
