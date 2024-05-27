"use client";

//DatePicker library
import {
  Datepicker,
  DatepickerEvent,
} from "@meinefinsternis/react-horizontal-date-picker";
import { enUS } from "date-fns/locale";

//React/Mui
import { Box, styled } from "@mui/material";
import { useEffect } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setDate } from "@/store/dateFilterSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.dark,
  margin: "1rem auto",
  "& .dr": {
    padding: "0 0.5rem",
  },
  "& .dM": {
    paddingTop: "0",
  },
  "& .jb": {
    color: theme.palette.primary.dark,
  },
  "& .FC": {
    backgroundColor: theme.palette.primary.dark,
    "& ._1g": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const dateRange = 100;

export default function DateFilter() {
  const dispatch = useDispatch();
  const date = useSelector((state: RootState) => state?.dateFilterSlice?.value);
  
  const sDate = new Date();
  const eDate = new Date();
  sDate.setDate(sDate.getDate() - dateRange / 2);
  eDate.setDate(eDate.getDate() + dateRange / 2);

  const handleChange = (d: DatepickerEvent) => {
    const [startValue, ev, rd] = d;
    dispatch(setDate(startValue));

    setTimeout(() => {
      const datePicker = document.getElementsByClassName("dr")[0];
      const pickedDate = document.getElementsByClassName("sDay")[0];
      const pickedDatePosition = pickedDate.getBoundingClientRect().x;

      datePicker.scrollBy({
        left: pickedDatePosition - datePicker.clientWidth / 2 - 30,
        behavior: "smooth",
      });
    }, 20);
  };

  useEffect(() => {
    const datePicker = document.getElementsByClassName("dr")[0];
    datePicker.scrollBy({
      left: datePicker.scrollWidth / 2 - datePicker.clientWidth / 2 - 30,
      behavior: "smooth",
    });
  }, []);

  return (
    <StyledBox>
      <Datepicker
        onChange={handleChange}
        locale={enUS}
        startValue={date}
        endValue={date}
        startDate={sDate}
        endDate={eDate}
        classNames={{ selectedDay: "sDay" }}
      />
    </StyledBox>
  );
}
 