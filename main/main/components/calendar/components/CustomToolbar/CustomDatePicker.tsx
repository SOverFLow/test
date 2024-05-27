"use client";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { UseDateFieldProps } from "@mui/x-date-pickers/DateField";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from "@mui/x-date-pickers/models";
import { useState } from "react";
import { IconButton } from "@mui/material";

interface ButtonFieldProps
  extends UseDateFieldProps<Date, false>,
    BaseSingleInputFieldProps<
      Date | null,
      Date,
      FieldSection,
      false,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <IconButton
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      <EditCalendarIcon />
    </IconButton>
  );
}

export default function ButtonDatePicker(
  props: Omit<DatePickerProps<Date>, "open" | "onOpen" | "onClose">
) {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      slots={{ ...props.slots, field: ButtonField }}
      slotProps={{ ...props.slotProps, field: { setOpen } as any }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}
