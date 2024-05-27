import { Event } from "../types/event";

const getAdjustedDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
};

const payloadToEvent = (payload: any) : Event => {
  return {
    id: payload.uid,
    start: new Date(payload.start_date),
    end: new Date(payload.end_date),
    title: payload.title,
    backgroundColor: payload.color || "#5CAB7D",
  };
};

function getDateAsNumber(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedDay = day < 10 ? '0' + day : day;
 return Number(`${year}${formattedMonth}${formattedDay}`);
}

export { getAdjustedDate, payloadToEvent, getDateAsNumber };
