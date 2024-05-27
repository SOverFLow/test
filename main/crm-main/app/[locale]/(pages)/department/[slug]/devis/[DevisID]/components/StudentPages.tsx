"use client";
import React, { useState, FC, useTransition } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    TextField,
    Grid,
    Box,
    CircularProgress,
    IconButton
  } from "@mui/material";
import ConventionPage from "./ConventionPage";
import PDFViewer from "./PDFViewer";
import { useParams } from "next/navigation";
import getStudentData, {
  getIfDepartmentIsFormation,
} from "../fetchUtils/fetchServerSide";
import Attestation from "./Attestation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";
import { SelectChangeEvent } from "@mui/material/Select";
import ReplayIcon from '@mui/icons-material/Replay';
import { Invoice } from '../data/types'
import dynamic from "next/dynamic";
import addInvoiceToBucket from "../fetchUtils/addInvoiceToBucket";
import sendInvoiceMail from "@/utils/sendMail";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDebounce } from "@uidotdev/usehooks";


  
const BlobProvider = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
    {
      ssr: false,
      loading: () => <CircularProgress />,
    }
  );
  
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <CircularProgress />,
    }
  );
interface Student {
    uid: string;
    name: string;
    email: string;
    status: "generated" | "Pending" | "Resent" | "error" | string;
}
  
  interface Props {
    students: Student[];
    data?: Invoice
  }
  
const StudentPage: FC<Props> = ({data, students }) => {
  const locale = useSelector((state: RootState) => state.langSlice.value);
  const department = useSelector((state: RootState) => state.departmentSlice.value);
  const debounced = useDebounce(data, 500);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("invoice");
  const [currentStudentIndex, setCurrentStudentIndex] = useState(-1);
  const [processing, setProcessing] = useState(false);

   if (!data) {
        return <div>No data available to generate PDFs.</div>;
    }
    const filteredStudents:Student[] = students?.filter(
        (Student) =>
          (statusFilter ? Student.status === statusFilter : true) &&
          (Student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Student.uid.toLowerCase().includes(searchTerm.toLowerCase()))
      ) as Student[];
      const emptyRows =
        page > 0
          ? Math.max(0, (1 + page) * rowsPerPage - (filteredStudents?.length || 0))
          : 0;
      const handleRowClick = (id: string) => {
        //UUID            
      };


      const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
      ) => {
        setPage(newPage);
      };

const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (
    event: SelectChangeEvent<typeof statusFilter>
  ) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };


  
  const handleResendClick = (student: Student) => {

    
  };

  async function handleSendEmail(
    blob: Blob,
    departmentName: string,
    data: Invoice,
    pathname: string
  ) {
    if (blob) {
      const path = await addInvoiceToBucket(departmentName, data.id, blob);
      if (path) {
        const res = await sendInvoiceMail({
          name: "younes",
          email:"younes.elguer@gmail.com",
          invoiceLink: path,
          confirmationLink: pathname,
        });
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.data);
        }
      }
    }
  }
    const processNextStudent = async (index:number) => {
      if (index < students.length) {
        setCurrentStudentIndex(index);
        students[index].status="generated"
        await new Promise(resolve => setTimeout(resolve, 4000)); 
        processNextStudent(index + 1);
      } else {
        setProcessing(false); 
        alert('All PDFs have been generated.');
      }
    };
  
    const handleStartProcessing = () => {
      if (!processing) {
        setProcessing(true);
        processNextStudent(0);
      }
    };

    return (
        <>
        <Container>
                 <Grid
            container
            spacing={2}
            alignItems="flex-end"
            justifyItems="center"
            justifyContent="space-between"
            sx={{ marginBottom: 2 }}
          >
            
            <Grid item>
            <Box>
            <h1>{t('student')}</h1>
            <button onClick={handleStartProcessing} disabled={processing}>
        Generate All PDFs
      </button>
      {processing && currentStudentIndex !== -1 && currentStudentIndex < students.length && data &&
       (
            <BlobProvider document={<Attestation pdfMode={true} data={data} />}>
                {({ blob, url, loading, error }) => {
                    if (loading) {
                        return <div>Generating PDF for {students[currentStudentIndex].name}...</div>;
                    }
                    if (error) {
                        console.error('Error generating PDF:', error);
                        return <div>Error generating PDF.</div>;
                    }
                    if (blob) {
                        console.log(`PDF generated for ${students[currentStudentIndex].name}`);
                        handleSendEmail(
                            blob as Blob,
                            department.name,
                            data,
                            `${process.env.NEXT_PUBLIC_HOSTNAME}/${locale}/department/${department.uid}/invoices/${data.id}/confirm`
                        );
                    }
                    return null;
                }}
            </BlobProvider>
        )}
          </Box>
              <TextField
                label={t('search-student')}
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ width: 300, height: 40 }}
              />
            </Grid>
            <Grid item>
              <Box >
              <p>filter</p>
              </Box>
              <Grid container sx={{  marginTop: 2}} spacing={1} alignItems="center">
                <Grid item>
                  
                  <Select
                    value={statusFilter}
                    displayEmpty
                    inputProps={{ "aria-label": t('without-label') }}
                    size="small" // Adjusting the size to match heights
                    sx={{ width: 160, height: 50 }}
                    onChange={handleStatusFilterChange}

                  >
                    <MenuItem value="">
                      <em>{t('none')}</em>
                    </MenuItem>
                    <MenuItem value="generated">{t('generated')}</MenuItem>
                    <MenuItem value="Pending">{t('Pending')}</MenuItem>
                    <MenuItem value="Resent">{t('Resent')}</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "primary.main",
                    "& th": { color: "white" },
                  }}
                >
                  <TableCell>uid</TableCell>      
                  <TableCell>{t('name')}</TableCell>
                  <TableCell>{t('email')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  <TableCell>resent</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
              {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                <TableRow key={student.uid} sx={{ "&:hover": { backgroundColor: "action.hover", cursor: "pointer" } }}>
                  <TableCell>{student.uid}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell sx={{ color: student.status === "generated" ? "success.main" : "error.main", fontWeight: "bold" }}>
                    {student.status}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleResendClick(student)} color="primary">
                      <ReplayIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
        </>
  );
}

export default StudentPage;