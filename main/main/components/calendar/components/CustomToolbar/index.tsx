"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ButtonGroup, Button, Typography, Box, styled } from "@mui/material";
import { ToolbarProps, View } from "react-big-calendar";
import { format, startOfWeek, endOfWeek } from "date-fns";
import ButtonDatePicker from "./CustomDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setDate } from "@/store/calendarDateSlice";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const StyledButton = styled(Button)(({ theme }) => ({
  height: 32,
  "&.Mui-disabled": {
    color: "white",
    backgroundColor: theme.palette.primary.dark,
  },
  color: "#fff",
  textTransform: "none",
}));

const CustomToolbar = ({
  date,
  onView,
  onNavigate,
  view,
  views,
}: ToolbarProps) => {
  const gDate = useSelector(
    (state: RootState) => state?.calendarDateSlice?.value
  );
  const dispatch = useDispatch();
  const t = useTranslations("calendar");

  useEffect(() => {
    onNavigate("DATE", gDate);
  }, [gDate, onNavigate]);

  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    onNavigate("TODAY");
  };

  const handleViewChange = (newView: View) => {
    onView(newView);
  };

  const handleDateChange = (newDate: any) => {
    const date = new Date(newDate);
    dispatch(setDate(date));
    onNavigate("DATE", new Date(newDate));
  };

  const formatDateDisplay = () => {
    switch (view) {
      case "month":
        return format(date, "MMMM yyyy");
      case "week":
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(start, "MMMM dd")} - ${format(end, "MMMM dd, yyyy")}`;
      case "day":
        return format(date, "MMMM dd, yyyy");
      case "agenda":
        return format(date, "MMMM yyyy");
      default:
        return format(date, "MMMM yyyy");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <StyledButton onClick={goToBack}>{t("Back")}</StyledButton>
        <StyledButton onClick={goToCurrent}>{t("Today")}</StyledButton>
        <StyledButton onClick={goToNext}>{t("Next")}</StyledButton>
      </ButtonGroup>

      <Box sx={{ display: "flex", alignItems: "center", height: 26 }}>
        <Typography variant="h6">{formatDateDisplay()}</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ButtonDatePicker value={gDate} onChange={handleDateChange} />
        </LocalizationProvider>
      </Box>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        {/* @ts-ignore */}
        {views.map(
          (name: any) =>
            name !== "week" && (
              <StyledButton
                key={name}
                onClick={() => handleViewChange(name)}
                disabled={view === name}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </StyledButton>
            )
        )}
      </ButtonGroup>
    </div>
  );
};

export default CustomToolbar;
