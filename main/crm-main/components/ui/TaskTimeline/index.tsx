"use client";
import StyledChip from "@/components/ui/StyledChip";
import formatDate, { formatTimeDifference } from "@/utils/formatDate";
import { Stepper, Step, styled } from "@mui/material";

const StyledStepper = styled(Stepper)(({ theme }) => ({
  flexWrap: "wrap",
  margin: "0 -8px",
}));

export default function TaskTimeline({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) {
  const formatedStartDate = formatDate(new Date(start_date));
  const formatedEndDate = formatDate(new Date(end_date));
  const timeDiff = formatTimeDifference(
    new Date(start_date),
    new Date(end_date)
  );

  return (
    <StyledStepper>
      <Step>
        <StyledChip label={formatedStartDate} size={"small"} />
      </Step>
      <Step>
        <StyledChip
          label={timeDiff || "0m"}
          variant="outlined"
          size={"small"}
        />
      </Step>
      <Step>
        <StyledChip label={formatedEndDate} size={"small"} />
      </Step>
    </StyledStepper>
  );
}
