"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import PickerTime from "../components/TimePicker";

const daysOfWeek: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimeShifts = () => {
  const [customHours, setCustomHours] = useState<any>([]);

  const handleCustomHoursChange = (day: any, time: any) => {
    const updatedCustomHours = [...customHours];
    updatedCustomHours[day] = time;
    setCustomHours(updatedCustomHours);
  };

  return daysOfWeek.map((day: string, index: number) => (
    <Box
      key={day}
      sx={{
        display: "flex",
        gap: "1rem",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography>{day}</Typography>
      {/* <PickerTime
        onSelect={(time: any) => handleCustomHoursChange(index, time)}
      /> */}
    </Box>
  ));
};

export default TimeShifts;
