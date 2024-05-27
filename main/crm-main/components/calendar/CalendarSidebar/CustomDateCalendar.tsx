"use client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setDate } from "@/store/calendarDateSlice";
import { styled } from "@mui/material";

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  width: "300px",
  height: "300px",
}));

export default function CustomDateCalendar() {
  const date = useSelector((state: RootState) => state?.calendarDateSlice?.value);
  const dispatch = useDispatch();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDateCalendar value={date} onChange={(e: Date) => dispatch(setDate(e))} />
    </LocalizationProvider>
  );
}
