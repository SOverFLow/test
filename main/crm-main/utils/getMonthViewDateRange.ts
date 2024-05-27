import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  format,
} from "date-fns";

function getMonthViewDateRange(date: Date) {
  // Assuming 'date' is within the month you're interested in
  const start = startOfMonth(date);
  // Adjust for timezone
  const adjustedStart = new Date(
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset())
  );
  const end = endOfMonth(date);
  // Adjust for timezone
  const adjustedEnd = new Date(
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset())
  );

  const viewStart = startOfWeek(adjustedStart, { weekStartsOn: 1 })
    .toISOString()
    .split("T")[0];
  const viewEnd = endOfWeek(adjustedEnd, { weekStartsOn: 0 })
    .toISOString()
    .split("T")[0];

  return [viewStart, viewEnd];
}

export { getMonthViewDateRange };
