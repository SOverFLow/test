"use client";
import TabSelect from "@/components/ui/TabSelect/TabSelect";
import { createClient } from "@/utils/supabase/client";
import { Box, FormControl, MenuItem, Select, styled } from "@mui/material";
import { useEffect, useState } from "react";

const StyledSelect = styled(Select)({
  // padding: "0px",
  "& .MuiSelect-select": {
    padding: "4px 6px",
  },
});

interface TaskStatusProps {
  taskData: any;
  taskId: string;
  initialStatus: string;
  tranlateObj: any;
  changeStatus?: (value: string | null) => void;
}

export default function TaskStatusDetails(props: TaskStatusProps) {
  const supabase = createClient();
  const [status, setStatus] = useState(props.initialStatus);

  const status_arr = [
    { value: "in_progress", label: props.tranlateObj.in_progress },
    { value: "done", label: props.tranlateObj.done },
    { value: "pending", label: props.tranlateObj.pending },
    { value: "delayed", label: props.tranlateObj.delayed },
  ];

  useEffect(() => {
    setStatus(props.initialStatus);
    console.log("statuss ----->>", props.initialStatus, props.taskData.status)
  }, [props.initialStatus]);

  const handleChange = (value: string | null) => {
    props.changeStatus && props.changeStatus(value);
  };

  const statusNames = [
    props.tranlateObj.in_progress,
    props.tranlateObj.done,
    props.tranlateObj.pending,
    props.tranlateObj.delayed,
  ];

  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl fullWidth>
        <TabSelect
          default={
            props.taskData.status
              ? status_arr.find(
                  (status: any) => status.value === props.taskData.status
                )?.label!
              : status_arr.find((status: any) => status.value === "in_progress")
                  ?.label!
          }
          itemsList={statusNames}
          onSelect={handleChange}
          placeholder={props.tranlateObj.status}
          variant="outlined"
        />
      </FormControl>
    </Box>
  );
}
