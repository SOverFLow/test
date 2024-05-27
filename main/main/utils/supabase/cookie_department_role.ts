import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { createClient } from "./department_role";

export const dynamic = "force-dynamic";

const getDbOnSeverDepartmentRole = cache(async () => {
  const cookieStore = cookies();
  return createClient(cookieStore);
});


export default getDbOnSeverDepartmentRole;
