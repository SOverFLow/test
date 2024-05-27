import { Paper } from "@mui/material";
import CustomDateCalendar from "./CustomDateCalendar";
import { useEffect, useState } from "react";
import TasksView from "./TasksView";
import { Event } from "../types/event";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getDateAsNumber } from "../utils/utils";

export default function CalendarSidebar({
  events,
  show,
  setShow,
}: {
  events: Event[];
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const date = useSelector((state: RootState) => state?.calendarDateSlice?.value);
  const [eventsOfTheDay, setEventsOfTheDay] = useState<Event[]>([]);
  useEffect(() => {
    const newDate = getDateAsNumber(date);
    setEventsOfTheDay(
      events.filter((event) => {
        const start = getDateAsNumber(event.start);
        const end = getDateAsNumber(event.end);
        return newDate >= start && newDate <= end;
      })
    );
  }, [date, events]);

  useEffect(() => {
    window.innerWidth < 768 && setShow(false);
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setShow(false);
      } else if (window.innerWidth > 1400) {
        setShow(true);
      }
    });
    return () => window.removeEventListener("resize", () => {});
  }, [setShow]);

  return (
    <Paper
      sx={{
        minWidth: show ? "305px" : 0,
        width: show ? "305px" : 0,
        height: "100%",
        transition: "all .4s ease",
        overflowY: "auto",
      }}
    >
      <CustomDateCalendar />
      <TasksView eventsOfTheDay={eventsOfTheDay} />
    </Paper>
  );
}
