"use server";
import { getDbOnSever } from "@/utils/supabase/cookie";
import { ObjectStructure } from "../../../workers/utils/types";
import parseInput, { matchPermissions } from "./parseDataPermission";
import treatRoleSubmit from "../../../workers/EditRole/treatRoleSubmit";
import {
  createNewRole,
  fetchTablesNameAndPriviligesForRole,
} from "../../../workers/EditRole/fetchData";

const checkUserIfExist = async (userId: string) => {
  const supabase = await getDbOnSever();

  const { data, error } = await supabase.rpc("check_user_exists", {
    user_id: userId,
  });
  if (error) {
    console.error("Error fetching user", error);
    return { error: error.message, data: false };
  }
  return { error: null, data: data as boolean };
};

const dataAlwaysTrue = {
  TaskColumn: {
    id: true,
    uid: true,
    title: true,
    created_at: true,
    department_id: true,
  },
  contract_service: {
    service_id: true,
    contract_id: true,
    uid: true,
  },
  task_user_worker: {
    task_id: true,
    user_worker_id: true,
  },
  client_department: {
    client_id: true,
    department_id: true,
  },
  DepartmentSettings: {
    id: true,
    tva: true,
    currency: true,
    created_at: true,
    department_id: true,
    pricing_hours: true,
    working_hours: true,
    minimal_minutes_per_task: true,
  },
  service_user_client: {
    uid: true,
    service_id: true,
    user_client_id: true,
  },
  contract_user_client: {
    uid: true,
    contract_id: true,
    user_client_id: true,
  },
  department_user_worker: {
    uid: true,
    department_id: true,
    user_worker_id: true,
  },
};

const savePermissions = async (
  userId: string,
  selectedRole: string,
  permissions: ObjectStructure,
  slug: string
) => {
  const results = { ...parseInput(permissions), ...dataAlwaysTrue };
  console.log("results", results);
  if (selectedRole === "worker") {
    const { data } = await createNewRole(`role1_${userId}`, slug);
    selectedRole = `role1_${userId}`;
  }
  await treatRoleSubmit(results, selectedRole, userId);
  const { data, error } =
    await fetchTablesNameAndPriviligesForRole(selectedRole);
  if (error) {
    console.error("Error fetching tables name:", error);
    return { error: error.message, data: null };
  }
  return { error: null, data: matchPermissions(data as ObjectStructure) };
};

const fetchNewPermissions = async (selectedRole: string) => {
  const { data, error } =
    await fetchTablesNameAndPriviligesForRole(selectedRole);
  if (error) {
    console.error("Error fetching tables name:", error);
    return { error: error.message, data: null };
  }
  return { error: null, data: matchPermissions(data as ObjectStructure) };
};

export { checkUserIfExist, savePermissions, fetchNewPermissions };
