import { Box } from "@mui/material";
import fetchDepartments from "./utils/fetchDepartments";
import WrapperCreateDepartment from "./CreateDepartment/WrapperCreateDepartment";
import ListDepartments from "./ListDepartments";
import DepartmentIdNotFoundPage from "./utils/DepartmentIdNotFoundPage";

export default async function Department() {
  const departments = await fetchDepartments();
  return (
    <Box mt={4}>
      <DepartmentIdNotFoundPage />
      {/* <WrapperCreateDepartment /> */}
      <ListDepartments departmentList={departments || []} />
    </Box>
  );
}
