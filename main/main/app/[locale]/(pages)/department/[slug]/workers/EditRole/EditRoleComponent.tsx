"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  fetchRolesName,
  fetchTablesNameAndPriviligesForRole,
} from "./fetchData";
import { sortObject } from "@/utils/sortObject";
import { ObjectStructure } from "../utils/types";
import RoleCheckbox from "./RoleCheckbox";

interface allStateProps {
  selectedRole: string;
  returnData: {};
}

export interface EditRoleProps {
  setAllState: (value: React.SetStateAction<allStateProps>) => void;
}
export default function EditRoleComponent({ setAllState }: EditRoleProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const departmentUid = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  console.log("departmentUid", departmentUid);
  const [returnData, setReturnData] = useState<any>({});
  const [roles, setRoles] = useState<{ title: string }[]>([]);
  const [isPending, startTransition] = useTransition();
  const [builtinRolesPrivileges, setBuiltinRolesPrivileges] = useState<any>({});
  const builtInRoles = useMemo(()=>["super_admin", "manager", "withoutdepartmentid"],[]);
  console.log("selectedRole firstpage", selectedRole);

  useEffect(() => {
    startTransition(async () => {
      const { data, error } = (await fetchTablesNameAndPriviligesForRole(
        selectedRole
      )) as { data: ObjectStructure; error: any };
      if (data) {
        setReturnData(sortObject(data));
        setAllState((prev) => ({ ...prev, returnData: sortObject(data) }));
        if (builtInRoles.includes(selectedRole)) {
          setBuiltinRolesPrivileges((prev:{})=>({...prev, [selectedRole]: data}));
        }
      }
      if (roles.length === 0) {
        const { data: allRoles, error } = await fetchRolesName();
        if (error) console.error("Error fetching roles name:", error);
        if (allRoles) setRoles(allRoles);
      }
    });
  }, [selectedRole, roles.length, setAllState, builtInRoles]);

  return (
    <>
      <RoleCheckbox
        {...{
          departmentUid,
          selectedRole,
          roles,
          returnData,
          setRoles,
          setSelectedRole,
          setReturnData,
          isPending,
          setAllState,
          builtinRolesPrivileges,
          builtInRoles,
        }}
      />
    </>
  );
}
