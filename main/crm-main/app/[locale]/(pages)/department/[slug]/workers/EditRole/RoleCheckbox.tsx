import {
  Add,
  ArrowBackIosNew,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTablesNameAndPriviligesForRole } from "./fetchData";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import RoleTextField from "./RoleTextField";
import { EditRoleProps } from "./EditRoleComponent";
import { isDeepEqual } from "@/utils/sortObject";
import CheckboxComponent from "./CheckboxComponent";

interface RoleCheckboxProps {
  isPending: boolean;
  roles: { title: string }[];
  returnData: any;
  departmentUid: string;
  selectedRole: string;
  builtinRolesPrivileges: any;
  builtInRoles: string[];
  setRoles: (value: React.SetStateAction<{ title: string }[]>) => void;
  setReturnData: (value: React.SetStateAction<any>) => void;
  setSelectedRole: (value: React.SetStateAction<string>) => void;
  setAllState: (value: React.SetStateAction<any>) => void;
}

const RoleCheckbox = ({
  isPending,
  roles,
  returnData,
  departmentUid,
  selectedRole,
  builtinRolesPrivileges,
  builtInRoles,
  setRoles,
  setReturnData,
  setSelectedRole,
  setAllState,
}: RoleCheckboxProps) => {
  const radioGroupRef = useRef<HTMLDivElement>(null);
  const [inputShow, setInputShow] = useState(false);

  const scroll = (speed: number, distance: number, step: number) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      if (radioGroupRef.current) {
        radioGroupRef.current.scrollLeft += step;
      }
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
  };

  const checkForChanges = useCallback(
    (role: string) => {
      // Implement logic to check for changes in the specific built-in role.
      // Placeholder returns false for now; adjust based on your application's logic.
      if (builtInRoles.includes(role)) {
        console.log("Built-in role selected");
        console.log("this is returndata:", returnData);
        console.log("this is builtinRolesPrivileges:", builtinRolesPrivileges);
        console.log(
          "this is builtinRolesPrivileges[role]:",
          builtinRolesPrivileges[role]
        );
        console.log(
          "are equal or not",
          isDeepEqual(returnData, builtinRolesPrivileges[role])
        );
        return true;
      }
      return false;
    },
    [builtInRoles, returnData, builtinRolesPrivileges]
  );

  const handleRoleChange = useCallback(
    (event: any) => {
      const selectedRoleEvent = event.target.value as string;
      setSelectedRole(selectedRoleEvent);
      setAllState((prev: EditRoleProps) => ({
        ...prev,
        selectedRole: selectedRoleEvent,
      }));
      if (
        builtInRoles?.includes(selectedRoleEvent) &&
        checkForChanges(selectedRoleEvent)
      ) {
        setInputShow(true);
      } else {
        fetchTablesNameAndPriviligesForRole(selectedRoleEvent);
      }
      fetchTablesNameAndPriviligesForRole(selectedRoleEvent);
    },
    [setSelectedRole, setAllState, builtInRoles, checkForChanges]
  );

  const handleShowInput = () => {
    setInputShow(true);
  };

  useEffect(() => {
    setAllState((prev: EditRoleProps) => ({ ...prev, returnData: returnData }));
  }, [returnData, setAllState]);

  useEffect(() => {
    if (selectedRole && roles.length > 0) {
      const selectedLabel = Array.from(
        radioGroupRef.current?.querySelectorAll("label") || []
      ).find((label) => label.textContent === selectedRole);

      if (selectedLabel) {
        selectedLabel.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }
  }, [selectedRole, roles]);

  useEffect(() => {
    console.log("return:", returnData);
  }, [returnData]);

  return (
    <DialogContent>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Box
            sx={{
              width: "100%",
              borderRadius: "4px",
              mb: 2,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
              },
              padding: "10px",
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Divider sx={{ flexGrow: 1, mx: 1 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", userSelect: "none" }}
              >
                Choose Role
              </Typography>
              <Divider sx={{ flexGrow: 1, mx: 1 }} />
            </Box>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={1}>
                <IconButton
                  onClick={() => scroll(25, 100, -10)}
                  disabled={!roles || roles.length <= 2}
                >
                  <ArrowBackIosNew />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <RadioGroup
                  ref={radioGroupRef}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  row
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                  }}
                >
                  {roles &&
                    roles.length > 0 &&
                    roles.map((role, index) => (
                      <FormControlLabel
                        key={index}
                        value={role.title}
                        control={
                          <Radio size="small" sx={{ color: "primary.main" }} />
                        }
                        label={role.title}
                        sx={{
                          width: "100%",
                          justifyContent: "start",
                          boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.05)",
                          borderRadius: "4px",
                          padding: "10px",
                          margin: "5px",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      />
                    ))}
                  <FormControlLabel
                    label={""}
                    value={"createNewRole"}
                    control={
                      <Button
                        onClick={handleShowInput}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.05)",
                          borderRadius: "4px",
                          width: "100%",
                          textTransform: "none",
                          backgroundColor: "#fff",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                        }}
                      >
                        <Add
                          sx={{
                            mr: 1,
                            verticalAlign: "bottom",
                            color: (theme) => theme.palette.primary.main,
                          }}
                        />
                        <Typography variant="body1" noWrap>
                          Create new Role
                        </Typography>
                      </Button>
                    }
                    sx={{
                      width: "100%",
                      justifyContent: "start",
                      borderRadius: "4px",
                      padding: "10px",
                      margin: "5px",
                    }}
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => scroll(25, 100, 10)}
                  disabled={!roles || roles.length <= 2}
                >
                  <ArrowForwardIosOutlined />
                </IconButton>
              </Grid>
            </Grid>
            {inputShow && (
              <RoleTextField
                {...{
                  departmentUid,
                  setInputShow,
                  setRoles,
                  setSelectedRole,
                  role: "",
                  setAllState,
                }}
              />
            )}
            {isPending && <NiceLoading />}
          </Box>
          <Box>
            {Object.keys(returnData).map((data: string, index: number) => {
              const dataWithKey = { [data]: { ...returnData[data] } };
              console.log("this is dataWithKey:", dataWithKey);
              console.log("this is data:", data);
              console.log("this is datawithkey:", dataWithKey[data]);
              return (
                <CheckboxComponent
                  key={index}
                  child={dataWithKey[data]}
                  label={data}
                  setSubmitData={setReturnData}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default RoleCheckbox;
