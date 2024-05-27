import React from "react";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "@/styles/multipleDatePicker.css"

interface MultipleDatePickerProps {
  onChange?: DatePickerProps<Dayjs[]>["onChange"];
  value?: Dayjs[];
  defaultDates?: Dayjs[];
  disabledDate?: (currentDate: Dayjs) => boolean;
}

export const MultipleDatePicker: React.FC<MultipleDatePickerProps> = ({
  onChange,
  defaultDates = [
    dayjs("2000-01-01"),
    dayjs("2000-01-03"),
    dayjs("2000-01-05"),
  ],
  disabledDate,
  value,
}) => {
  return (
    <DatePicker
      multiple
      placeholder="Select Dates"
      size="large"
      onChange={onChange}
      maxTagCount="responsive"
      value={value}
      defaultValue={defaultDates}
      disabledDate={disabledDate}
    />
  );
};
