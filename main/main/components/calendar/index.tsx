"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  styled,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Styles
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style/style.css";

// Custom components
import WrapperCreateTask from "@/app/[locale]/(pages)/department/[slug]/tasks/createTask/WrapperCreateTask";
import EventComponent from "./components/EventComponent";
import CustomToolbar from "./components/CustomToolbar";
import CalendarSidebar from "./CalendarSidebar";
import surpressWarn from "@/utils/surpressWarn";
import { toast } from "react-toastify";
import { updateEventDate } from "./utils/actions";
import { Event } from "./types/event";
import { createClient } from "@/utils/supabase/client";
import { payloadToEvent } from "./utils/utils";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { lightenColor } from "./components/utils/utilsDesign";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CustumButton } from "../ui/Button/CustumButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.light,
  height: 32,
  width: 32,
  position: "absolute",
  top: "33px",
  left: -16,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
}));

function MyCalendar({ initialEvents }: { initialEvents: any[] }) {
  surpressWarn(); // Suppress default props warning
  const [openSlot, setOpenSlot] = useState(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState({
    start: new Date(),
    end: new Date(),
    start_hour: {},
    end_hour: {},
  });
  const [dialogOpenSteper, setDialogOpenSteper] = useState(false);
  const [view, setView] = useState<View | undefined>("month");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [isChecked, setIsCheck] = useState(false);
  const [role, setRole] = useState<string>("");
  const t = useTranslations("calendar");
  const departmentId = useSelector(
    (state: RootState) => state.departmentSlice.value?.uid
  );

  useEffect(() => {
    const supabase = createClient();
    const getRole = async () => {
      const userRole = (await supabase.auth.getUser()).data.user?.role;
      if (!userRole) {
        return;
      }
      setRole(userRole);
    };
    getRole();
  }, []);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .channel("calendarEvents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Task",
          filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prevEvents) => [
              ...prevEvents,
              payloadToEvent(payload.new),
            ]);
          } else if (payload.eventType === "UPDATE") {
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event.id === payload.new.uid
                  ? payloadToEvent(payload.new)
                  : event
              )
            );
          } else if (payload.eventType === "DELETE") {
            setEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== payload.old.uid)
            );
          }
        }
      )
      .subscribe();
    () => supabase.channel("calendarEvents").unsubscribe();
  }, [departmentId]);

  const onEventResize = useCallback(
    async (data: EventInteractionArgs<Event | object>) => {
      const { event, start, end } = data;
      updateEventPosition(event, new Date(start), new Date(end));
      try {
        await updateEventDate(
          (event as Event).id,
          start as string,
          end as string,
          isChecked
        );
      } catch (e) {
        console.log("error: ", e);
        toast.error(t("failed-to-update-event-date"));
      }
    },
    [t, isChecked]
  );

  const onEventDrop = useCallback(
    async (data: EventInteractionArgs<Event | object>) => {
      const { event, start, end } = data;
      updateEventPosition(event, new Date(start), new Date(end));
      try {
        await updateEventDate(
          (event as Event).id,
          start as string,
          end as string,
          isChecked
        );
      } catch (e) {
        console.log("error: ", e);
        toast.error(t("failed-to-update-event-date"));
      }
    },
    [t, isChecked]
  );

  const updateEventPosition = (event: any, start: Date, end: Date) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e === event ? { ...e, start, end } : e))
    );
  };

  const handleSelectSlot = useCallback(async (slotInfo: any) => {
    const supabase = createClient();
    const userRole = (await supabase.auth.getUser()).data.user?.role;
    if (!userRole) {
      return;
    }
    if (userRole !== "super_admin") {
      return;
    }
    setOpenSlot(true);
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
      start_hour: dayjs(
        `${slotInfo.start.getHours()}:${slotInfo.start.getMinutes()}`,
        "HH:mm"
      ),
      end_hour: dayjs(
        `${slotInfo.end.getHours()}:${slotInfo.end.getMinutes()}`,
        "HH:mm"
      ),
    });
  }, []);

  const onViewChange = useCallback((view: View) => {
    setView(view);
  }, []);

  const onNavigate = useCallback((date: Date) => {
    setDate(date);
  }, []);

  const onSelectEvent = useCallback((event: any) => {
    console.log("Event selected", event);
  }, []);

  function deleteEvent(eventId: string) {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  }

  const handleCheck = () => {
    setIsCheck((prev) => !prev);
  };

  const eventPropGetter = (event: any) => {
    const backgroundColor = lightenColor(event.backgroundColor, 0.1);
    return { style: { backgroundColor } };
  };

  return (
    <div>
      {role === "super_admin" && (
        <Box
          display={"flex"}
          gap={".3rem"}
          flexWrap={"wrap"}
          sx={{ marginBottom: "20px" }}
          justifyContent={"space-between"}
        >
          <CustumButton
            label={
              <>
                <AddCircleOutlineIcon />
                {t("Create Task")}
              </>
            }
            onClick={() => setDialogOpenSteper(true)}
          />

          <FormControlLabel
            control={
              <StyledSwitch
                sx={{ marginX: "5px" }}
                checked={isChecked}
                onChange={handleCheck}
              />
            }
            label={
              isChecked
                ? t("change-date-for-all-depending-task-yes")
                : t("change-date-for-all-depending-task-no")
            }
            labelPlacement="start"
          />
        </Box>
      )}
      <Box
        height={"calc(100vh - 170px)"}
        maxHeight={"calc(100vh - 170px)"}
        display={"flex"}
        gap={".3rem"}
      >
        <CalendarSidebar
          events={events}
          show={showSidebar}
          setShow={setShowSidebar}
        />
        <Box
          width={showSidebar ? "calc(100% - 305px)" : "100%"}
          position={"relative"}
          sx={{ backgroundColor: "white", transition: "all .4s ease"}}
        >
          <StyledIconButton
            sx={{ transform: showSidebar ? "rotate(0)" : "rotate(180deg)" }}
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            <ArrowBackIosNewIcon />
          </StyledIconButton>
          <DnDCalendar
            defaultDate={moment().toDate()}
            date={date}
            view={view}
            onView={onViewChange}
            events={events}
            eventPropGetter={eventPropGetter}
            localizer={localizer}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={onSelectEvent}
            onNavigate={onNavigate}
            handleDragStart={(e) => console.log("onDragStart", e)}
            selectable
            resizable
            // popup
            messages={{
              showMore: (total) => `+${total} ${t("more")}`,
            }}
            views={{
              month: true,
              week: true,
              day: true,
              agenda: true,
            }}
            popupOffset={{ x: 30, y: 20 }}
            style={{
              height: "100%",
              width: "100%",
              minHeight: "500px",
            }}
            components={{
              event: (props) => <EventComponent {...props} />,
              toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Box>
      {openSlot && (
        <WrapperCreateTask
          dialogOpenSteper={openSlot}
          setDialogOpenSteper={setOpenSlot}
          showAddButton={false}
          selectedSlot={selectedSlot}
        />
      )}
      {dialogOpenSteper && (
        <WrapperCreateTask
          dialogOpenSteper={dialogOpenSteper}
          setDialogOpenSteper={setDialogOpenSteper}
          showAddButton={true}
        />
      )}
    </div>
  );
}
export default MyCalendar;
