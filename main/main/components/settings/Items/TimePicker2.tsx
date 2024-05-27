import { Box } from "@mui/material";
import { TimePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

interface PickerTime2Props {
  onChange?: (value: any, dateString: [string, string]) => void;
  value?: [dayjs.Dayjs, dayjs.Dayjs];
}

export default function PickerTime2(props: PickerTime2Props) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        width: { xs: "100%", md: "80%" },
        alignItems: "end",
      }}
      autoFocus={false}
    >
      <TimePicker.RangePicker
        autoFocus={false}
        value={
          props.value || [dayjs("12:08", "HH:mm"), dayjs("13:08", "HH:mm")]
        }
        style={{
          height: "2.3rem",
          width: "100%",
          justifyContent: "end",
          color: "#000000",
          backgroundColor: "#fff",
        }}
        popupStyle={{ zIndex: 9999 }}
        open={open}
        onOpenChange={setOpen}
        placeholder={["Start Time", "End Time"] as [string, string]}
        format="HH:mm"
        onChange={props.onChange} // Use the onChange prop
      />
    </Box>
  );
}
