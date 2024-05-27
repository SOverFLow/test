import { Box } from "@mui/material";
import StudentWrapper from "./StudentWrapper";
import fetchServerStudents from "./utils/fetchServerStudents";
import StudentsTable from "./StudentTable";



export default async function Students({
  params,
}: {
  params: { slug: string };
}) {
  const studentsData = await fetchServerStudents(params.slug);


  return (
    <>
      <StudentWrapper />
      <Box>
        <StudentsTable studentData={studentsData || []} />
      </Box>
    </>
  );
}