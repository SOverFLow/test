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
  Tooltip,
} from "@mui/material";

import Box from "@mui/material/Box";
import { useTransition, useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { SelectChangeEvent } from "@mui/material/Select";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { getAllInvoices } from "../devis/[DevisID]/fetchUtils/fetchServerSide";
import getInvoiceData, { InvoiceDataToAvoir } from "./utils";
import Modal from "../devis/[DevisID]/components/pdfComponents/Modal";
import { useTranslations } from "next-intl";
import "../devis/[DevisID]/scss/main.scss";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import InvoiceStatusSelect from "./InvoiceStatusSelect";

interface Invoice {
  uid: string;
  id: string;
  startDate: string;
  name: string;
  amount: string;
  status: "Paid" | "Confirmed" | "Pending" | "Draft" | string;
}

const Invoices = ({ params }: { params: { slug: string } }) => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [invoices, setInvoices] = useState<Invoice[]>();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [linkToBeShown, setLinkToBeShown] = useState("");
  const [clientEmail, setclientEmail] = useState("");
  const [invoiceUid, setInvoiceUid] = useState("");
  const t = useTranslations("invoice");

  const filteredInvoices: Invoice[] = invoices?.filter(
    (invoice) =>
      (statusFilter ? invoice.status === statusFilter : true) &&
      (invoice.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        invoice.id?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        invoice.startDate?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        invoice.amount?.toLowerCase().includes(searchTerm?.toLowerCase()))
  ) as Invoice[];
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (filteredInvoices?.length || 0))
      : 0;
  const router = useRouter();

  const handleRowClick = (id: string) => {
    //UUID
    startTransition(async () => {
      const checkIfInvoiceExists = await getInvoiceData(id);
      if (checkIfInvoiceExists && checkIfInvoiceExists.link_in_bucket) {
        setShowModal((prev) => !prev);
        setLinkToBeShown(checkIfInvoiceExists.link_in_bucket as string);
        setclientEmail(checkIfInvoiceExists?.Client?.email as string);
        setInvoiceUid(id as string);
      } else {
        toast.error(`${t("invoice-not-found")}`, {
          position: "top-right",
        });
      }
      return;
    });
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

  useEffect(() => {
    const invoiceChannel = supabase
      .channel("realtime:invoiceChannel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Invoice",
          filter: "department_id=eq." + departmentId,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setInvoices((prevInvoices: any) => [
              {
                uid: payload.new.uid as string,
                id: ("ref_" + payload.new.id.toString()) as string,
                startDate: payload.new.date_issued as string,
                name: payload.new.title,
                amount: `${payload.new.currency?.toString()}${payload.new.invoice_price?.toString()}`,
                status: payload.new.status,
              },
              ...prevInvoices,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      invoiceChannel.unsubscribe();
    };
  });

  const handleCanceledInvoiceAndGenerateAvoire = async (invoiceId: string) => {
    const avoir = await InvoiceDataToAvoir(invoiceId);
    if (!avoir) {
      toast.error(t("Avoir is Already created for this invoice"), {
        position: "top-right",
      });
    } else {
      toast.success(t("Avoir is created successfully"), {
        position: "top-right",
      });
    }
  };

  const handleCreateAvoir = (avoirUid: string) => {
    router.push(`/department/${params.slug}/devis/${avoirUid}?avoir=true`);
  };

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllInvoices(params.slug);
      setInvoices(data);
    });
  }, [params.slug]);
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  return (
    <>
      {!invoices || isPending ? (
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
          {showModal ? (
            <Modal
              modalShow={showModal}
              modalClose={() => setShowModal(false)}
              url={linkToBeShown}
              Clientemail={clientEmail}
              invoiceUid={invoiceUid}
            />
          ) : null}

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
                <h1>{t("invoices")}</h1>
                <p>
                  {t("there-are")} {invoices.length} {t("total-invoices")}
                </p>
              </Box>
              <TextField
                label={t("search-invoices")}
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
                    <MenuItem value="Paid">{t("Paid")}</MenuItem>
                    <MenuItem value="Pending">{t("Pending")}</MenuItem>
                    <MenuItem value="Avoir">Avoir</MenuItem>
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
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell>{t("amount")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>create Avoire</TableCell>
                  <TableCell>{t("actions")}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? filteredInvoices.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredInvoices
                ).map((invoice, index) => (
                  <TableRow
                    key={invoice.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                      },
                      textDecoration: "none",
                    }}
                  >
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.name}</TableCell>
                    <TableCell>
                      {invoice.startDate && formatDate(invoice.startDate)}
                    </TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          invoice.status === "Paid"
                            ? "success.main"
                            : invoice.status === "Draft"
                              ? "error.main"
                              : "warning.main",
                        fontWeight: "bold",
                      }}
                    >
                      {invoice.status == "Avoir" ||
                      invoice.status == "avoir" ? (
                        invoice.status
                      ) : (
                        <InvoiceStatusSelect
                          defaultValue={invoice.status}
                          invoiceUid={invoice.uid}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      {invoice.status != "Avoir" &&
                        invoice.status != "avoir" && (
                          <Tooltip
                            title={t("Generate Avoir From this Invoice")}
                          >
                            <IconButton
                              onClick={() =>
                                handleCanceledInvoiceAndGenerateAvoire(
                                  invoice.uid
                                )
                              }
                              color="primary"
                            >
                              <ReceiptLongIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      {(invoice.status == "Avoir" ||
                        invoice.status == "avoir") && (
                        <Tooltip title={t("Generate Avoir Document")}>
                          <IconButton
                            onClick={() => handleCreateAvoir(invoice.uid)}
                            color="primary"
                          >
                            <NoteAddIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={t("Show Pdf Document")}>
                        <IconButton
                          onClick={() => handleRowClick(invoice.uid)}
                          color="primary"
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
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
            count={filteredInvoices?.length || 0}
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

export default Invoices;
