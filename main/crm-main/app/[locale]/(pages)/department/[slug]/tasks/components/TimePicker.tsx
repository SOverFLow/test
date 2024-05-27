import { Box } from "@mui/material";
import { TimePicker } from "antd";
import { useState } from "react";
import dayjs from 'dayjs';

export default function PickerTime(props: {
  onSelect: (time: any) => void;
  value?: any;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        width: { xs: "100%", md: "80%" },
        alignItems: "end",
      }}
      style={props.style}
      autoFocus={false}
    >
      <TimePicker.RangePicker
        autoFocus={false}
        value={
          props.value
            ? [dayjs(props.value[0]), dayjs(props.value[1])]
            : [dayjs(new Date().setHours(7)), dayjs(new Date().setHours(8))]
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
        onChange={props.onSelect}
        disabled={props.disabled}
      />
    </Box>
  );
}
