"use client";
import { getCurrency } from "@/app/api/settings/actions/getCurrency";
import fetchInvoiceId from "@/components/calendar/utils/fetchInvoiceId";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { TabSelectTask } from "@/components/ui/TabSelect/TabSelectTask";
import { RootState } from "@/store";
import { taskSchema } from "@/utils/schemas/task/taskSchema";
import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import CurrencyList from "currency-list";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import EstimatedPrice from "../components/EstimatedPrice";
import { MultiAutocompleteWorkers } from "../components/MultiAutocompleteWorkers";
import ListFilesForNewTask from "../components/NewTaskFiles";
import ProductList from "../components/ProductPreview";
import SellingPrice from "../components/SellingPrice";
import TaskStatus from "../components/TaskStatus";
import PickerTime from "../components/TimePicker";
import {
  getData,
  getProductsInStockForTask,
  getProductsOutOfStockForTask,
} from "../createTask/FunctionUtils";
import ProductsSelecter from "../createTask/products";
import { getTaskData } from "../EditTask/FunctionUtils";
import fetchWorkersTables from "../utils/fetchWorkersTables";
import Comments from "./Comments";
import TaskImages from "./TaskImages";
import fetchStudentsTask from "../utils/fetchStudentsTask";
import TaskStatusDetails from "../components/TaskStatusDetails";
import { createClient } from "@/utils/supabase/client";

const Input = styled(TextField)({
  width: "100%",
});

// Custom Avatar component for MUI
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.getContrastText(theme.palette.grey[200]),
}));

type Department = {
  uid: string;
  title: string;
};

export default function Page({ params }: { params: { taskId: string } }) {
  const supabase = createClient();
  const translate = useTranslations("taskpopup");
  const t = useTranslations("AddTaskForm");
  const tranlateObj = {
    in_progress: t("In progress"),
    done: t("Done"),
    pending: t("Pending"),
    delayed: t("Delayed"),
    Task_per_Hours: t("Task per Hours"),
    Task_per_Days: t("Task per Days"),
    info_general: t("Information general"),
    info_location: t("Time and location"),
    consumubles_services: t("Consumubles and services"),
    worker_info: t("Workers and client info"),
    price_summary: t("Selling price and summary"),
    Formtitle: t("Formtitle"),
    title: t("title"),
    select_from_map: t("select from map"),
    description: t("description"),
    date: t("Task Date"),
    task_type: t("Task type"),
    address: t("address"),
    worker: t("worker"),
    status: t("status"),
    client: t("client"),
    priority: t("priority"),
    price: t("price"),
    long: t("long"),
    lattitude: t("lattitude"),
    start_date: t("start_date"),
    end_date: t("end_date"),
    add_button: t("add_button"),
    cancel_button: t("cancel_button"),
    Create_Task: t("Create Task"),
    New_Task: t("New Task"),
    dependecy: t("dependency of task"),
    Work_Hours: t("Work Hours"),
    select_property: t("select property"),
    add_new_property: t("add new property"),
    consumables_From_Stock: t("Consumables From Stock"),
    Add_Product: t("Add Product"),
    consumables_out_the_stock: t("consumables out the stock"),
    Quantity_for: t("Quantity for"),
    Select_Client: t("Select Client"),
    Select_Worker: t("Select Worker"),
    Add_Worker: t("Add Worker"),
    Add_Client: t("Add Client"),
    low: t("Low"),
    medium: t("Medium"),
    high: t("High"),
    Selling_Price: t("Selling Price"),
    desired_product: t("select"),
    search: t("search"),
    add: t("Add"),
    No_consumables_found: t("No consumables found"),
    hour: t("hour"),
    day: t("day"),
    Edit_Task: t("Edit Task"),
    update_task: t("Update the task"),
    save: t("save"),
    select_service: t("select one or more service"),
    Delete: t("Delete"),
    Service: t("Service"),
    Quantity: t("Quantity"),
    total_cost: t("Total cost"),
    Additional_cost: t("Additional costs"),
    add_service: t("Add New Service"),
    update_success: t("Task updated successfully"),
    update_error: t("Error updating task"),
    error_fetching: t("Error fetching element"),
    students: t("Students"),
    Select_students: t("Select students"),
    Selling_Price_HT: t("Selling Price HT"),
    Selling_Price_ttc: t("Selling Price TTC"),
    add_contract: t("Create New Contract for Service"),
  };
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [taskData, setTaskData] = useState<any>({
    title: "",
    description: "",
    address: "",
    status: "",
    priority: "",
    client_id: "",
    cost: "",
    long: 0.0,
    lattitude: 0.0,
    start_date: "",
    end_date: "",
    task_type: "hours",
    start_hour: 0,
    end_hour: 0,
    depend_on_id: null,
    services: [],
  });
  const [pending, startTransition2] = useTransition();
  const [productsFromStock, setProductsFromStock] = useState<any[]>([]);
  const [ProductsNotInStock, setProductsNotInStock] = useState<any[]>([]);
  const [selected_products_in_stock, setSelected_products_in_stock] =
    useState<any>();
  const [selected_products_out_stock, setSelected_products_out_stock] =
    useState<any>();
  const [taskStudents, setTaskStudents] = useState<any[] | null>([]);
  const [clients, setClients] = useState<any[] | null>([]);
  const [workers, setWorkers] = useState<any[] | null>([]);
  const [students, setStudents] = useState<any[] | null>([]);
  const [taskWorkers, setTaskWorkers] = useState<any[] | null>([]);
  const [currencyConfig, setCurrencyConfig] = useState({
    locale: "Europe",
    currency: "EUR",
  });
  const [taskPermissions, setTaskPermissions] = useState<any>();
  const [filesBlob, setFilesBlob] = useState<string[]>([]);
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [isCenterFormation, setIsCenterFormation] = useState(false);

  useEffect(() => {
    const DepartementType = async () => {
      if (departmentId) {
        const { data, error } = await supabase
          .from("Department")
          .select("is_center_formation")
          .eq("uid", departmentId);
        if (error) {
          toast.error(error.message, {
            position: "bottom-right",
          });
          return;
        }
        const department = data[0];
        setIsCenterFormation(department?.is_center_formation!);
      }
    };
    DepartementType();
  }, [departmentId, supabase]);

  const onSelectStudents = (value: any[]) => {
    if (value) {
      setTaskData({ ...taskData, ["students"]: value });
    }
  };

  useEffect(() => {
    if (params.taskId) {
      getTaskData(params.taskId).then((data) => {
        if (data) {
          setTaskData(data);
          setSelected_products_in_stock(
            data?.selected_products_in_stock as any[]
          );
          setSelected_products_out_stock(
            data?.selected_products_out_stock as any[]
          );
          setFilesBlob(data?.files!);
        }
      });
      fetchWorkersTables(params.taskId)
        .then((data: any) => {
          return setTaskWorkers(
            data?.map((worker: any) => {
              return worker.UserWorker;
            })
          );
        })
        .catch((error) => console.error(error));
      fetchStudentsTask(params.taskId)
        .then((data) => {
          if (data) {
            setTaskStudents(
              data?.map((worker: any) => {
                return worker.Student;
              })
            );
          }
        })
        .catch((error) => console.error(error));
    }
  }, [params.taskId]);

  useEffect(() => {
    if (departmentId) {
      getProductsOutOfStockForTask(departmentId)
        .then((data) => {
          if (data) {
            setProductsNotInStock(data ?? []);
          }
        })
        .catch((error) => console.error(error));

      getProductsInStockForTask(departmentId)
        .then((data) => {
          if (data) {
            setProductsFromStock(data ?? []);
          }
        })
        .catch((error) => console.error(error));

      getData(departmentId).then((data) => {
        if (data) {
          console.log(data);
          setClients(data[0]);
          setWorkers(data[1]);
          setStudents(data[2]);
        }
      });
      const fetchData = async () => {
        const data = await getCurrency(departmentId);
        if (!data?.error) {
          setCurrencyConfig({
            locale: data?.success?.currency,
            currency: data?.success?.currency,
          });
        } else {
          toast(tranlateObj.error_fetching, {
            position: "bottom-right",
          });
        }
      };
      fetchData();
    }
  }, [departmentId, tranlateObj.error_fetching]);

  useEffect(() => {
    function getCUrrencySymbol(currency: string) {
      const currencyObj = CurrencyList.get(currency);
      if (currencyObj) {
        return currencyObj.symbol;
      }
      return currency;
    }
    setCurrencySymbol(getCUrrencySymbol(currencyConfig.currency!));
  }, [currencyConfig]);

  const AddService = (value: any) => {
    setTaskData(function (prevState: any) {
      if (prevState.services === null)
        return {
          ...prevState,
          ["services"]: [value],
        };
      return {
        ...prevState,
        ["services"]: [...prevState?.services, value],
      };
    });
    setDisable(false);
  };

  const DeleteService = (value: any) => {
    setTaskData((prevState: any) => ({
      ...prevState,
      ["services"]: prevState.services.filter((service: any) => {
        return service.selection.uid !== value;
      }),
    }));
    setDisable(false);
  };

  const onSelectClient = (value: any | null) => {
    if (value) {
      setTaskData({ ...taskData, ["client_id"]: value.uid });
    }
    setDisable(false);
  };

  const onSelectWorker = (value: any) => {
    if (value) {
      setTaskData({ ...taskData, ["workers"]: value });
    }
    setDisable(false);
  };

  useEffect(() => {
    if (taskWorkers) {
      setTaskData((prevState: any) => ({
        ...prevState,
        ["workers"]: taskWorkers,
      }));
    }
  }, [taskWorkers]);

  // useEffect(() => {
  //   fetchTablesNameAndPriviligesForRole("admin").then(({ data, error }) => {
  //     setTaskPermissions(data);
  //   });
  // }, []);

  const handleCustomHoursChange = (time: any) => {
    setTaskData((prevState: any) => {
      const newStartDate = new Date(prevState.start_date);
      const newEndDate = new Date(prevState.end_date);
      newStartDate.setHours(new Date(time[0]).getHours());
      newStartDate.setMinutes(new Date(time[0]).getMinutes());
      newEndDate.setHours(new Date(time[1]).getHours());
      newEndDate.setMinutes(new Date(time[1]).getMinutes());

      return {
        ...prevState,
        start_date: newStartDate,
        end_date: newEndDate,
        ["start_hour"]: new Date(time[0]),
        ["end_hour"]: new Date(time[1]),
      };
    });
    setDisable(false);
  };

  const onInputChange = (name: string, value: any) => {
    setTaskData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
    setDisable(false);
  };

  const handleChangePriority = (event: SelectChangeEvent) => {
    setTaskData((prevState: any) => ({
      ...prevState,
      ["priority"]: event.target.value,
    }));
    setDisable(false);
  };

  const handleNewFiles = useCallback((files: string[], urls: string[]) => {
    console.log("Received URLs:", urls);
    console.log("Received files:", files);

    setTaskData((prevState: any) => ({
      ...prevState,
      files: [...(prevState.files || []), ...urls],
    }));
  }, []);

  const status_arr = [
    { value: "in_progress", label: tranlateObj.in_progress },
    { value: "done", label: tranlateObj.done },
    { value: "pending", label: tranlateObj.pending },
    { value: "delayed", label: tranlateObj.delayed },
  ];

  const onSelectStatus = (value: string | null) => {
    if (value) {
      const index = status_arr.findIndex((status) => status.label === value);
      setTaskData({ ...taskData, ["status"]: status_arr[index].value });
      console.log("status_arr[index].value", status_arr[index].value);
    }
  };

  const onSubmit = async () => {
    const returnvalue = taskSchema.safeParse({
      ...taskData,
      ["start_hour"]: new Date(taskData.start_hour).getHours(),
      ["end_hour"]: new Date(taskData.end_hour).getHours(),
      ["start_date"]: new Date(taskData.start_date),
      ["end_date"]: new Date(taskData.end_date),
    });

    const allData = {
      ...taskData,
      department_id: departmentId,
      selected_products_out_stock: selected_products_out_stock,
      selected_products_in_stock: selected_products_in_stock,
      cost: parseFloat(taskData.cost) + parseFloat(taskData.additional_cost),
    };

    if (returnvalue.success) {
      try {
        const err = await axios.put("/api/task", allData);
        console.log("errrooooor", err);
        toast.success(tranlateObj.update_success, {
          position: "bottom-right",
        });
      } catch (error) {
        toast.error(tranlateObj.update_error, {
          position: "bottom-right",
        });
      }
      setSelected_products_in_stock([]);
      setSelected_products_out_stock([]);
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          toast.error(issue.message);
          return acc;
        },
        {} as Record<string, string>
      );
    }
    setDisable(true);
  };

  const handleRedirect = useCallback(
    (url: string) => {
      startTransition2(async () => {
        if (url != "devis") {
          router.push(url);
          return;
        } else {
          const invoiceId = await fetchInvoiceId(params.taskId);
          if (invoiceId) {
            router.push(`../devis/${invoiceId}`);
            return;
          } else {
            console.log("Devis not found");
            router.push(`../devis`);
          }
        }
      });
    },
    [router, params.taskId]
  );

  const buttonGridTobeShown = useMemo(
    () => [
      {
        content: translate("related-tasks"),
        url: `../calendar/${params.taskId}`,
        redirect: handleRedirect,
      },
      {
        content: translate("generate-devis"),
        url: "devis",
        redirect: handleRedirect,
      },
    ],
    [translate, handleRedirect, params.taskId]
  );

  return (
    <>
      {/* arrow back */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          paddingLeft: { xs: "0.5rem", md: "3rem" },
          flexDirection: { lg: "row", xs: "column" },
          marginBottom: "1rem",
        }}
      >
        <Tooltip title="Abort">
          <IconButton
            color="primary"
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: "10%",
            }}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBack sx={{ fontSize: "3rem" }} />
          </IconButton>
        </Tooltip>
        <Grid
          container
          display={"flex"}
          spacing={2}
          paddingTop={"1.5rem"}
          paddingLeft={"1rem"}
          width={{ xs: "100%", lg: "50%" }}
        >
          {buttonGridTobeShown.map((obj, index) => (
            <Grid
              key={index}
              item
              md={6}
              xs={12}
              display={"flex"}
              width={"100%"}
            >
              <Button
                onClick={() => obj.redirect(obj.url)}
                sx={{
                  p: "4px",
                  borderRadius: 2,
                  color: "#fff",
                  width: "200px",
                  textTransform: "none",
                }}
                disabled={pending}
              >
                <Stack alignItems="center" direction="row">
                  <Typography fontSize={"16px"} fontWeight={""}>
                    {obj.content}
                  </Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          maxWidth: "6xl",
          mx: "auto",
          px: 4,
          py: 8,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 4,
          paddingLeft: { xs: "1.5rem", md: "4rem" },
          paddingTop: "1rem",
          paddingRight: "2rem",
          flexDirection: "column",
        }}
      >
        {/* first box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "90%",
          }}
        >
          {/* Task Details Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Task Details <EditIcon />
            </Typography>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#ADADAD",
                fontWeight: 300,
              }}
            >
              View and manage the details of this task.
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gap: 2 }}>
            <FormControl fullWidth>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                Title
              </Typography>
              <TextField
                id="title"
                name="title"
                value={taskData?.title ? taskData?.title : ""}
                variant="outlined"
                onChange={(e) => onInputChange("title", e.target.value)}
                // disabled={taskPermissions?.task?.title === true ? false : true}
              />
            </FormControl>
            <FormControl>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                Task status
              </Typography>
              <TaskStatusDetails
                taskData={taskData}
                tranlateObj={tranlateObj}
                taskId={taskData.uid}
                initialStatus={taskData.status}
                changeStatus={onSelectStatus}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                Description
              </Typography>
              <TextArea
                rows={2}
                placeholder={tranlateObj.description}
                value={taskData?.description ? taskData?.description : ""}
                maxLength={200}
                name="description"
                onChange={(e) => onInputChange("description", e.target.value)}
                // disabled={
                //   taskPermissions?.task?.description === true ? false : true
                // }
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {tranlateObj.start_date}
                </Typography>
                <DatePicker
                  placeholder="Select Date for Task"
                  format="DD/MM/YYYY"
                  width={"100%"}
                  value={
                    taskData?.start_date ? dayjs(taskData?.start_date) : ""
                  }
                  style={{
                    boxShadow: "none",
                    width: "100%",
                  }}
                  popupStyle={{
                    zIndex: 9999,
                  }}
                  onChange={(value: any) => {
                    setTaskData((prevState: any) => ({
                      ...prevState,
                      ["start_date"]: value && new Date(value ?? new Date()),
                    }));
                    setDisable(false);
                  }}
                  // disabled={
                  //   taskPermissions?.task?.start_date === true ? false : true
                  // }
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {tranlateObj.end_date}
                </Typography>
                <DatePicker
                  placeholder="Select Date for Task"
                  format="DD/MM/YYYY"
                  value={taskData?.end_date ? dayjs(taskData?.end_date) : ""}
                  width={"100%"}
                  style={{
                    boxShadow: "none",
                    width: "100%",
                  }}
                  popupStyle={{
                    zIndex: 9999,
                  }}
                  onChange={(value: any) => {
                    setTaskData((prevState: any) => ({
                      ...prevState,
                      ["end_date"]: value && new Date(value ?? new Date()),
                    }));
                    setDisable(false);
                  }}
                  // disabled={
                  //   taskPermissions?.task?.end_date === true ? false : true
                  // }
                />
              </Grid>
            </Grid>

            {/* Time picker */}

            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {tranlateObj.Work_Hours}
              </Typography>
              <PickerTime
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "end",
                }}
                value={[taskData?.start_hour, taskData?.end_hour]}
                onSelect={(time: any) => {
                  handleCustomHoursChange(time);
                  setDisable(false);
                }}
                // disabled={
                //   taskPermissions?.task?.start_hour === true ? false : true
                // }
              />
            </Grid>

            {/* Address and Geo-c marginTop={"1rem"}oordinates Section */}
            <FormControl fullWidth>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {tranlateObj.address}
              </Typography>
              <TextArea
                rows={2}
                placeholder={tranlateObj.address}
                value={taskData?.address ? taskData?.address : ""}
                maxLength={200}
                name="adress"
                onChange={(e) => onInputChange("address", e.target.value)}
                // disabled={taskPermissions?.task?.adress === true ? false : true}
              />
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    {tranlateObj.priority}
                  </Typography>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    value={taskData?.priority ? taskData?.priority : ""}
                    hiddenLabel
                    onChange={handleChangePriority}
                    // disabled={
                    //   taskPermissions?.task?.priority === true ? false : true
                    // }
                  >
                    <MenuItem value="low">{tranlateObj.low}</MenuItem>
                    <MenuItem value="medium">{tranlateObj.medium}</MenuItem>
                    <MenuItem value="high">{tranlateObj.high}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* {taskPermissions?.task?.cost && ( */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    {tranlateObj.total_cost}
                  </Typography>
                  <TextField
                    fullWidth
                    autoFocus={false}
                    hiddenLabel
                    label=""
                    value={taskData?.cost ? taskData?.cost : null}
                    type="number"
                    variant="outlined"
                    margin="none"
                    onChange={(e) => {
                      onInputChange("cost", e.target.value);
                    }}
                    // disabled={
                    //   taskPermissions?.task?.cost === true ? false : true
                    // }
                  />
                </FormControl>
              </Grid>
              {/* )} */}
            </Grid>

            {/* Additional cost  */}
            {/* {taskPermissions?.task?.cost && ( */}
            <FormControl fullWidth>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {tranlateObj.Additional_cost}
              </Typography>
              <TextField
                fullWidth
                autoFocus={false}
                hiddenLabel
                label=""
                value={
                  taskData?.additional_cost ? taskData?.additional_cost : null
                }
                type="number"
                variant="outlined"
                margin="none"
                placeholder={tranlateObj.Additional_cost}
                onChange={(e) => {
                  // check if the user change it for second time
                  setTaskData((prevState: any) => ({
                    ...prevState,
                    ["additional_cost"]: parseFloat(e.target.value),
                  }));
                  setDisable(false);
                }}
              />
            </FormControl>
            {/* )} */}

            <Grid item xs={12} marginTop={"0.3rem"}>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {tranlateObj.client}
              </Typography>
              <TabSelectTask
                itemsList={clients!}
                default={
                  taskData?.client_id
                    ? clients?.find(
                        (client) => client.uid === taskData?.client_id
                      )
                    : null
                }
                onSelect={onSelectClient}
                placeholder={tranlateObj.client}
                variant="outlined"
                label=""
                // disabled={
                //   taskPermissions?.task?.client_id === true ? false : true
                // }
              />
            </Grid>

            {/* Workerds section */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {tranlateObj.worker}
              </Typography>
              <MultiAutocompleteWorkers
                defaultValue={taskWorkers!}
                label=""
                placeholder={tranlateObj.Select_Worker}
                workers={workers!}
                onSelectedValuesChange={onSelectWorker}
                variant="outlined"
                // disabled={taskPermissions?.task?.workers === true ? false : true}
              />
            </Grid>

            {/* If it's a center de formnation  */}
            {isCenterFormation && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {tranlateObj.students}
                </Typography>
                <MultiAutocompleteWorkers
                  label=""
                  placeholder={tranlateObj.Select_students}
                  workers={students!}
                  defaultValue={taskStudents!}
                  onSelectedValuesChange={onSelectStudents}
                  variant="outlined"
                  // disabled={taskPermissions?.task?.workers === true ? false : true}
                />
              </Grid>
            )}

            {/* Consumables and Services Section */}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6} marginTop={"1rem"}>
                  <FormControl fullWidth>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                      }}
                      gutterBottom
                    >
                      Consumables from stock
                    </Typography>
                    <ProductsSelecter
                      products={productsFromStock}
                      addedProducts={selected_products_in_stock}
                      onChange={(value: any) => {
                        setSelected_products_in_stock(value);
                        setDisable(false);
                      }}
                      tranlateObj={tranlateObj}
                      // disabled={
                      //   taskPermissions?.task?.selected_products_in_stock === true
                      //     ? false
                      //     : true
                      // }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} marginTop={"1rem"} width={"100%"}>
                  <FormControl fullWidth>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                      }}
                      gutterBottom
                    >
                      Consumables out stock
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <ProductsSelecter
                        products={ProductsNotInStock}
                        addedProducts={selected_products_out_stock}
                        onChange={(value: any) => {
                          setSelected_products_out_stock(value);
                          setDisable(false);
                        }}
                        tranlateObj={tranlateObj}
                        // disabled={
                        //   taskPermissions?.task?.selected_products_out_stock ===
                        //   true
                        //     ? false
                        //     : true
                        // }
                      />
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            {/* list products */}
            {selected_products_out_stock && (
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"start"}
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                <ProductList
                  products={selected_products_out_stock}
                  onDelete={(uid) => {
                    setDisable(false);
                    setSelected_products_out_stock((prevProducts: any) => {
                      const newProducts = prevProducts.filter(
                        (product: any) => product.uid !== uid
                      );
                      return newProducts;
                    });
                  }}
                  // disabled={
                  //   taskPermissions?.task?.selected_products_out_stock === true
                  //     ? false
                  //     : true
                  // }
                />
              </Grid>
            )}

            {selected_products_in_stock && (
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"start"}
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                <ProductList
                  products={selected_products_in_stock}
                  onDelete={(uid) => {
                    setDisable(false);
                    setSelected_products_in_stock((prevProducts: any) => {
                      const newProducts = prevProducts.filter(
                        (product: any) => product.uid !== uid
                      );
                      return newProducts;
                    });
                  }}
                  // disabled={
                  //   taskPermissions?.task?.selected_products_in_stock === true
                  //     ? false
                  //     : true
                  // }
                />
              </Grid>
            )}

            {/* list services from taskdata */}
            {/*taskPermissions?.task?.services && */}
            {/* {showAddService && ( */}
            <Grid item xs={12}>
              <SellingPrice
                client_id={taskData.client_id}
                bien_id={taskData.bien_id!}
                translateObj={tranlateObj}
                departement_id={departmentId}
                onAddOption={AddService}
                onDeleteOption={DeleteService}
                workingHours={
                  new Date(taskData.end_hour)?.getHours() -
                  new Date(taskData.start_hour)?.getHours()
                }
                alreadyAddedOptions={taskData?.services}
              />
            </Grid>
            {/* )} */}
          </Box>
        </Box>
        {/* seconde box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: { xs: "0.5rem", md: "0rem", lg: "1.5rem" },
          }}
        >
          <TaskImages
            taskId={params.taskId}
            ChangeStatus={() => {
              setDisable(false);
            }}
          />

          <ListFilesForNewTask
            files={filesBlob}
            setFiles={setFilesBlob}
            ChangeFiles={handleNewFiles}
            folder="task"
          />

          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
            gutterBottom
          >
            Comments
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Comments
              taskId={params.taskId}
              ChangeStatus={() => {
                setDisable(false);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Grid item xs={12}>
            <EstimatedPrice
              additional_cost={parseFloat(taskData.additional_cost)}
              currency={currencySymbol}
              worker_salary={taskData?.workers}
              products_out_stock={selected_products_out_stock}
              products_in_stock={selected_products_in_stock}
              task={taskData}
              onEstimateChange={(task_cost: number, services_cost: number) => {
                setDisable(false);
                setTaskData({
                  ...taskData,
                  ["cost"]: task_cost,
                  ["selling_price"]: services_cost,
                  ["profit_net"]: services_cost - task_cost,
                });
              }}
            />
          </Grid>
          {/* Save and Cancel Buttons */}
          <Box
            sx={{
              display: "flex",
              mt: 2,
              alignItems: "end",
              justifyContent: "end",
            }}
          >
            <CustumButton
              disabled={disable}
              onClick={() => {
                onSubmit();
              }}
              label={tranlateObj.update_task}
              style={{
                height: "2rem",
                padding: "1rem",
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
