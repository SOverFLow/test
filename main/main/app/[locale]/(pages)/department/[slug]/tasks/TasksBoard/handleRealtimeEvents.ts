import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Column } from "../utils/types";

function realtimeColumnChanged(
  payload: RealtimePostgresChangesPayload<{
    [key: string]: any;
  }>,
  oldColumns: Column[]
): Column[] {
  let newColumns: Column[] = [];

  if (payload.eventType === "INSERT") {
    console.log("New column added!");
    newColumns = [
      ...oldColumns,
      { uid: payload.new.uid, title: payload.new.title },
    ];
  } else if (payload.eventType === "DELETE") {
    console.log("Column deleted!");
    newColumns = oldColumns.filter((col) => col.uid !== payload.old.uid);
  }
  return newColumns;
}

export { realtimeColumnChanged };
