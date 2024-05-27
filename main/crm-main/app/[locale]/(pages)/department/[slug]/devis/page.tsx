"use client";

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
  CircularProgress,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";

import Box from "@mui/material/Box";
import { useTransition, useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Modal from "./[DevisID]/components/pdfComponents/Modal";
import "./[DevisID]/scss/main.scss";
import { useTranslations } from "next-intl";
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import getInvoiceData, {
  DuplicateDevis,
  getDevisData,
  getInvoiceDataFromDevis,
  updateDevisStatus,
} from "../invoices/utils";
import DevisModal from "./DevisModal";
import { getAllDevis } from "./[DevisID]/fetchUtils/fetchServerSide";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import StatusSelect from "./[DevisID]/components/StatusSelect";

interface Devis {
  id: string;
  startDate: string;
  title: string;
  amount: number;
  client: string;
  tva: string;
  uid: string;
  status: "Confirmed" | "Pending" | "Canceled" | string;
  currency: string;
}

const Devis = ({ params }: { params: { slug: string } }) => {
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [devis, setDevis] = useState<Devis[]>();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [linkToBeShown, setLinkToBeShown] = useState("");
  const t = useTranslations("invoice");
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);

  const filteredDevis: Devis[] = devis?.filter(
    (devis) =>
      (statusFilter ? devis?.status === statusFilter : true) &&
      (devis?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis?.startDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis?.currency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis?.client?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) as Devis[];
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (filteredDevis?.length || 0))
      : 0;
  const router = useRouter();

  const handleRowClick = (uuid: string) => {
    setShowModal(true);
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

  const handleStatusFilterChange = (
    event: SelectChangeEvent<typeof statusFilter>
  ) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCreateDevis = (deviId: string, deviUid: string) => {
    router.push(`/department/${params.slug}/devis/${deviUid}`);
  };

  const handleCreateInvoice = (deviUid: string) => {
    startTransition(async () => {
      const checkDevis = await getDevisData(deviUid);
      console.log("checkDevis", checkDevis);
      if (checkDevis && checkDevis.confirmed && checkDevis.link_in_bucket) {
        const checkIfDevisExists = await getInvoiceDataFromDevis(deviUid);
        if (checkIfDevisExists) {
          toast.success(t("Invoice genereted Success"), {
            position: "bottom-right",
          });
          router.push(`/department/${params.slug}/invoices`);
        } else {
          toast.success(t("Invoice already genereted"), {
            position: "bottom-right",
          });
          router.push(`/department/${params.slug}/invoices`);
        }
      } else {
        toast.error(t("create devis first or devis not confirmed"), {
          position: "bottom-right",
        });
      }
    });
  };

  // const err = await createNewInvoice(body, postData[0].uid);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleCreateDuplicateDevis = (devisId: string) => {
    const devisToDuplicate = devis?.find((d) => d.uid === devisId);
    if (devisToDuplicate) {
      setSelectedDevis(devisToDuplicate);
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (formData: Devis) => {
    // console.log("Duplicated Devis Data:", formData);
    const data = await DuplicateDevis(formData.uid, formData);
    if (data) {
      toast.success(t("Devis Duplicated Success"), {
        position: "bottom-right",
      });
    } else {
      toast.error(t("Devis Duplicated Failed"), {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    const devisChannel = supabase
      .channel("realtime:devisChannel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Devis",
          filter: "department_id=eq." + departmentId,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            console.log("payload", payload);
            setDevis((prevDevis: any) => [
              {
                uid: payload.new.uid as string,
                id: ("devis_00" + payload.new.id.toString()) as string,
                startDate: payload.new.date_issued as string,
                title: payload.new.title,
                amount: payload.new.devis_price,
                currency: payload.new.currency?.toString(),
                status: payload.new.status,
                tva: payload.new.tva,
                // client: payload.new.Client?.first_name + " " + payload.new.Client?.last_name,
              },
              ...prevDevis,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      devisChannel.unsubscribe();
    };
  });

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllDevis(params.slug);
      setDevis(data);
    });
  }, [params.slug]);

  return (
    <>
      {!devis || isPending ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "80dvh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container>
          {selectedDevis && (
            <DevisModal
              open={showModal}
              handleClose={() => setShowModal(false)}
              devis={selectedDevis}
              onSubmit={handleModalSubmit}
            />
          )}

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
                <h1>{t("devis")}</h1>
              </Box>
              <TextField
                label={t("search-devis")}
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ width: 300, height: 40 }}
              />
            </Grid>
            <Grid item>
              <Box>
                <p>filter</p>
              </Box>
              <Grid
                container
                sx={{ marginTop: 2 }}
                spacing={1}
                alignItems="center"
              >
                <Grid item>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    displayEmpty
                    inputProps={{ "aria-label": t("without-label") }}
                    size="small" // Adjusting the size to match heights
                    sx={{ width: 160, height: 50 }}
                  >
                    <MenuItem value="">
                      <em>{t("none")}</em>
                    </MenuItem>
                    <MenuItem value="Confirmed">{t("Confirmed")}</MenuItem>
                    <MenuItem value="Pending">{t("Pending")}</MenuItem>
                    <MenuItem value="Canceled">{t("Canceled")}</MenuItem>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>TVA</TableCell>
                  <TableCell>Create devis</TableCell>
                  <TableCell>Duplicate devis</TableCell>
                  <TableCell>transfer to invoice</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? filteredDevis?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredDevis
                )?.map((devis, index) => (
                  <TableRow
                    key={devis.id + index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                      },
                      textDecoration: "none",
                    }}
                  >
                    <TableCell>{devis.id}</TableCell>
                    <TableCell>{devis.title}</TableCell>
                    <TableCell>{devis.amount + devis.currency}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          devis.status === "Confirmed"
                            ? "success.main"
                            : devis.status === "Canceled"
                              ? "error.main"
                              : "warning.main",
                        fontWeight: "bold",
                      }}
                    >
                      <StatusSelect
                        defaultValue={devis.status}
                        devisUid={devis.uid}
                      />
                      {/* {devis.status} */}
                    </TableCell>
                    <TableCell>
                      {devis.startDate && formatDate(devis.startDate)}
                    </TableCell>
                    <TableCell>{devis.client}</TableCell>
                    <TableCell>
                      {devis.tva ? devis.tva + "%" : 0 + "%"}
                    </TableCell>
                    <TableCell>
                    <Tooltip title={t('Generate Devis Document')}>
                      <IconButton
                        onClick={() => handleCreateDevis(devis.id, devis.uid)}
                        color="primary"
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                    <Tooltip title={t('Duplicate Devis')}>
                      <RepeatOneOnIcon
                        onClick={() => handleCreateDuplicateDevis(devis.uid)}
                        color="primary"
                      />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                    <Tooltip title={t('Generate Invoice From this Devis')}>
                      <NoteAddIcon
                        onClick={() => handleCreateInvoice(devis.uid)}
                        color="primary"
                      />
                      </Tooltip>
                    </TableCell>
                    
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDevis?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
      )}
    </>
  );
};

export default Devis;
