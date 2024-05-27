"use server";
import { getTablePermissionForSpecificRows } from ".";

// Define TypeScript interfaces for clarity and type safety
interface TableRow {
  tableName: string;
  rows: string[] | NestedTable[];
}

interface NestedTable extends TableRow {}

async function checkTablePermissions(
  roleName: string,
  table: TableRow
): Promise<string> {
  let result: string[] = [];
  for (const row of table.rows) {
    if (typeof row === "string") {
      const permission = await getTablePermissionForSpecificRows(
        roleName,
        table.tableName,
        [row]
      );
      if (permission) {
        result.push(permission);
      }
    } else if (typeof row === "object" && "tableName" in row) {
      const nestedResult = await checkTablePermissions(roleName, row);
      if (nestedResult) {
        result.push(`${row.tableName}(${nestedResult})`);
      }
    }
  }

  return result.join(", ");
}

async function getTablePermissions(
  roleName: string,
  tableName: string,
  row: string,
  nestedTables: TableRow[]
): Promise<string> {
  const permissions = [];
  const tablePermissions = await getTablePermissionForSpecificRows(
    roleName,
    tableName,
    row.split(", ")
  );
  permissions.push(tablePermissions);
  for (const table of nestedTables) {
    const tablePermissions = await checkTablePermissions(roleName, table);
    if (tablePermissions) {
      permissions.push(`${table.tableName}(${tablePermissions})`);
    }
  }
  return permissions.join(",");
}

export default getTablePermissions;
