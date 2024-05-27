"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Toast } from "@/components/ui/Toast/Toast";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import treatRoleSubmit from "./treatRoleSubmit";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import {
  fetchRolesName,
  fetchTablesNameAndPriviligesForRole,
  getRoleOfWorker,
} from "./fetchData";
import { ObjectStructure } from "../utils/types";
import { sortObject } from "@/utils/sortObject";
import RoleCheckbox from "./RoleCheckbox";

interface EditRoleProps {
  worekerId: number | string;
}

export default function EditRole(props: EditRoleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [returnData, setReturnData] = useState<any>({});
  const [roles, setRoles] = useState<{ title: string }[]>([]);
  const departmentUid = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const [isPending, startTransition] = useTransition();
  const [builtinRolesPrivileges, setBuiltinRolesPrivileges] = useState<any>({});
  const builtInRoles = useMemo(()=>["super_admin", "manager", "withoutdepartmentid"],[]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRole("");
  };

  const onSubmit = async () => {
    console.log("submit");
    console.log("aftersubmit", returnData);
    console.log("departmentUid", departmentUid);
    console.log("props.worekerId", props.worekerId);
    console.log("selectedRole", selectedRole);
    await treatRoleSubmit(returnData, selectedRole, props.worekerId as string);
    const datar = await getTablePermissionForSpecificRows(
      selectedRole,
      "UserWorker",
      [
        "last_name",
        "created_at",
        "first_name",
        "updated_at",
        "task_cost_id",
        "avatar",
      ]
    );
  };

  useEffect(() => {
    if (dialogOpen) {
      startTransition(async () => {
        if (selectedRole === "") {
          const roleOfWorker = await getRoleOfWorker(props.worekerId as string);
          setSelectedRole(roleOfWorker as string);
        }
        const { data, error } = (await fetchTablesNameAndPriviligesForRole(
          selectedRole
        )) as {
          data: ObjectStructure;
          error: any;
        };
        if (error) {
          console.error("Error fetching tables name:", error);
          return;
        }
        if (data) {
          setReturnData(sortObject(data));
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
    }
  }, [selectedRole, dialogOpen, roles.length, props.worekerId, builtInRoles]);

  return (
    <>
      <Toast
        message={message}
        backgroundColor={bgcolor}
        open={open}
        setOpen={setOpen}
      />
      <Box>
        <Box>
          <Tooltip title="Modify Role" disableInteractive>
            <Button
              variant="text"
              color="success"
              onClick={handleOpenDialog}
              sx={{
                width: "30px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              size="small"
            >
              <AdminPanelSettingsIcon />
            </Button>
          </Tooltip>
        </Box>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Modify Role</Typography>
            </Box>
          </DialogTitle>
          <RoleCheckbox
            {...{
              isPending,
              roles,
              returnData,
              departmentUid,
              selectedRole,
              setRoles,
              setReturnData,
              setSelectedRole,
              setAllState: () => {},
              builtinRolesPrivileges,
              builtInRoles,
            }}
          />
          <DialogActions>
            <CustumButton label="Cancel" onClick={handleCloseDialog} />
            <CustumButton label={"Save"} onClick={onSubmit} />
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
