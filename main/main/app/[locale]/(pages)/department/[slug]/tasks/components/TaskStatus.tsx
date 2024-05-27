"use client";
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
  taskId: string;
  initialStatus: string;
  changeStatus?: (status: string) => void;
}

export default function TaskStatus(props: TaskStatusProps) {
  const supabase = createClient();
  const [status, setStatus] = useState(props.initialStatus);

  useEffect(() => {
    setStatus(props.initialStatus);
  }, [props.initialStatus]);

  const handleChange = async (event: any) => {
    setStatus(event.target.value);
    // await supabase
    //   .from("Task")
    //   .update({ status: event.target.value })
    //   .eq("uid", props.taskId);

    props.changeStatus && props.changeStatus(status);
  };

  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl fullWidth>
        <StyledSelect
          value={status}
          onChange={handleChange}
          autoFocus
          size="small"
        >
          <MenuItem value={"pending"}>pending</MenuItem>
          <MenuItem value={"in_progress"}>in progress</MenuItem>
          <MenuItem value={"done"}>done</MenuItem>
          <MenuItem value={"delayed"}>delayed</MenuItem>
        </StyledSelect>
      </FormControl>
    </Box>
  );
}
