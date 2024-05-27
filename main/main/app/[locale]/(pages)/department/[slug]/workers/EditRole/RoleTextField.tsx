import { useCallback, useState } from "react";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { Add } from "@mui/icons-material";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { createNewRole } from "./fetchData";
import { EditRoleProps } from "./EditRoleComponent";

interface RoleTextFieldProps {
  role: string;
  departmentUid: string;
  setRoles: (value: React.SetStateAction<{ title: string }[]>) => void;
  setInputShow: (value: React.SetStateAction<boolean>) => void;
  setSelectedRole: (value: React.SetStateAction<string>) => void;
  setAllState: (value: React.SetStateAction<EditRoleProps>) => void;
}

const RoleTextField = ({
  departmentUid,
  setRoles,
  setInputShow,
  setSelectedRole,
  setAllState,
}: RoleTextFieldProps) => {
  const [role, setRole] = useState("");
  const handleChangeRoleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  return (
    <TextField
      sx={{
        display: "flex",
        margin: "5px 0px",
      }}
      label="Role Name"
      type="text"
      fullWidth
      name="roleName"
      value={role}
      onChange={handleChangeRoleName}
      size="small"
      InputProps={{
        endAdornment: (
          <CustomButtonControl
            {...{
              departmentUid,
              setInputShow,
              setRoles,
              setSelectedRole,
              role,
              setAllState,
            }}
          />
        ),
      }}
    />
  );
};

const CustomButtonControl = ({
  departmentUid,
  setInputShow,
  setRoles,
  setSelectedRole,
  role,
  setAllState,
}: RoleTextFieldProps) => {
  const handleCreateNewRole = useCallback(async () => {
    try {
      const { data } = await createNewRole(role, departmentUid);
      console.log("datarole from create new role", data);
      setInputShow(false);
      setRoles(data || []);
      setSelectedRole(role);
      setAllState((prev) => ({
        ...prev,
        selectedRole: role,
      }));
    } catch (error) {
      console.log("error", error);
    }
  }, [
    role,
    departmentUid,
    setRoles,
    setInputShow,
    setSelectedRole,
    setAllState,
  ]);

  return (
    <InputAdornment position="end">
      <CustumButton
        label={
          <>
            <Add />
            <Typography variant="body1" noWrap  sx={{display:{xs:'none',sm:'flex'}}}>
              Create new Role
            </Typography>
          </>
        }
        onClick={handleCreateNewRole}
      />
    </InputAdornment>
  );
};

export default RoleTextField;
