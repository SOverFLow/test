"use client";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { RootState } from "@/store";
import { setAddress } from "@/store/addressSlice";
import theme from "@/styles/theme";
import { taskSchema } from "@/utils/schemas/task/taskSchema";
import { createClient } from "@/utils/supabase/client";
import { Close, ListOutlined } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import CurrencyList from "currency-list";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateBien from "../../biens/CreateBien";
import CreateClient from "../../clients/CreateClient";
import CreateProduct from "../../products/CreateProduct";
import CreateWorker from "../../workers/CreateWorker";
import NewTaskImages from "../[taskId]/TaskImages/NewTaskImages";
import { deleteImageForNewTask } from "../[taskId]/TaskImages/actions";
import AddressField from "../components/AddressField";
import BienAutocomplete from "../components/BienAutocomplete";
import EstimatedPrice from "../components/EstimatedPrice";
import { MultiAutocompleteWorkers } from "../components/MultiAutocompleteWorkers";
import ListFilesForNewTask from "../components/NewTaskFiles";
import ProductList from "../components/ProductPreview";
import SelectClient from "../components/SelectClient";
import SelectEnseignant from "../components/SelectEnseignant";
import SelectPriority from "../components/SelectPriority";
import Selectstatus from "../components/Selectstatus";
import SellingPrice from "../components/SellingPrice";
import VerticalLinearStepper from "../components/verticalStepper";
import CreateTaskFirstStep from "./CreateTaskFirstStep";
import {
  getBien,
  getData,
  getProductsInStockForTask,
  getProductsOutOfStockForTask,
} from "./FunctionUtils";
import ProductsSelecter from "./products";
import { DatePickerModal } from "./repeateTask";

const Map = dynamic(() => import("@/components/ui/Map/Map"), {
  loading: () => <NiceLoading />,
  ssr: false,
});

interface props {
  tranlateObj: any;
  dialogOpenSteper: boolean;
  setDialogOpenSteper: (value: boolean) => void;
  showAddButton: boolean;
  selectedSlot?: any;
}

export default function CreateTask4Formation(props: props) {
  const supabase = createClient();
  const dispatch = useDispatch();
  const textFieldRef = useRef(null);
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const address = useSelector(
    (state: RootState) => state?.addressReducer?.address
  );
  const [suggestions, setSuggestions] = useState([]);
  const defaultStartTimeRef = useRef(new Date());
  const defaultEndTimeRef = useRef(new Date());
  const defaultStartDateRef = useRef(new Date());
  const defaultEndDateRef = useRef(new Date());
  const [dialogOpenClient, setDialogOpenClient] = useState(false);
  const [dialogOpenWorker, setDialogOpenWorker] = useState(false);
  const [clients, setClients] = useState<any>([]);
  const [workers, setWorkers] = useState<any>([]);
  const [students, setstudents] = useState<any>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [property, setProperty] = useState(false);
  const [newAdd, setNewAdd] = useState(false);
  const [newLatitude, setnewLatitude] = useState(48.8588897);
  const [newLongitude, setLongitude] = useState(2.3200410217200766);
  const [bien, setBien] = useState<any[]>([]);
  const [products, setProducts] = useState<any>([]);
  const [productsOutStock, setProductsOutStock] = useState<any>([]);
  const [selected_products_out_stock, setSelected_products_out_stock] =
    useState<any[]>([]);
  const [selected_products_in_stock, setSelected_products_in_stock] = useState<
    any[]
  >([]);
  const [currencyConfig, setCurrencyConfig] = useState({
    locale: "Europe",
    currency: "EUR",
  });
  const [currencySymbol, setCurrencySymbol] = useState<string>("");
  const [tasks, setTasks] = useState<any>([]);
  const [imagesBlob, setImagesBlob] = useState<any>([]);
  const [filesBlob, setFilesBlob] = useState<any>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<any>({
    title: "",
    description: "",
    address: "",
    status: "in_progress",
    priority: "low",
    client_id: "",
    cost: 0.0,
    long: 0.0,
    lattitude: 0.0,
    start_date: props.selectedSlot?.start
      ? props.selectedSlot?.start
      : defaultStartDateRef.current,
    end_date: props.selectedSlot?.end
      ? props.selectedSlot?.end
      : defaultEndDateRef.current,
    task_type: "hours",
    start_hour: defaultStartTimeRef.current,
    end_hour: defaultEndTimeRef.current,
    depend_on_id: null,
    selected_products_out_stock: [],
    selected_products_in_stock: [],
    workers: [],
    services: [],
    color: "#00acc1",
    profit_net: 0,
    selling_price: 0,
    images: [],
    files: [],
    bien_id: null,
    dates: [
      {
        start_date: props.selectedSlot?.start ?? defaultStartDateRef.current,
        end_date: props.selectedSlot?.end ?? defaultEndDateRef.current,
      },
    ],
  });

  useEffect(() => {
    const tasks = async () => {
      if (departmentId) {
        const { data, error } = await supabase
          .from("Task")
          .select("uid, title")
          .eq("department_id", departmentId)
          .order("start_date", { ascending: false });
        if (error) {
          toast.error(error.message, {
            position: "bottom-right",
          });
          return;
        }
        setTasks(data);
      }
    };
    tasks();
  }, [departmentId, supabase]);

  useEffect(() => {
    setDisable(false);
  }, newTask);

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

  useEffect(() => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["address"]: address,
    }));
  }, [address]);

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    console.log("input", input);
    dispatch(setAddress(input));

    if (input.length > 1) {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }&limit=5`
        )
        .then((response) => {
          setSuggestions(response.data.features);
        })
        .catch((error) => console.log("Error:", error));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      const input = event.target.value;
      dispatch(setAddress(input));
      setNewTask({
        ...newTask,
        ["address"]: input,
      });
      setSuggestions([]);
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        )
        .then((response) => {
          setnewLatitude(parseFloat(response.data.features[0].center[1]));
          setLongitude(parseFloat(response.data.features[0].center[0]));
        })
        .catch((error) => console.log("Error:", error));
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    dispatch(setAddress(suggestion.place_name));
    dispatch({ payload: 2, type: "VerticalSteperSlice/setActiveStep" });
    setNewTask({
      ...newTask,
      ["address"]: suggestion.place_name,
    });
    setSuggestions([]);
    await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          suggestion.place_name
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      )
      .then((response) => {
        setnewLatitude(parseFloat(response?.data?.features[0]?.center[1]));
        setLongitude(parseFloat(response?.data?.features[0]?.center[0]));
      })
      .catch((error) => console.log("Error:", error));
  };

  useMemo(() => {
    if (departmentId) {
      getProductsOutOfStockForTask(departmentId)
        .then((data) => {
          if (data) {
            setProductsOutStock(data ?? []);
          }
        })
        .catch((error) => console.error(error));

      getProductsInStockForTask(departmentId)
        .then((data) => {
          if (data) {
            setProducts(data ?? []);
          }
        })
        .catch((error) => console.error(error));

      getData(departmentId)
        .then((data) => {
          if (data) {
            setClients(data[0] ?? []);
            setWorkers(data[1] ?? []);
            setstudents(data[2] ?? []);
          }
        })
        .catch((error) => console.error(error));
    }
    if (departmentId && newTask.client_id) {
      getBien(departmentId, newTask.client_id)
        .then((data) => {
          if (data !== undefined) {
            setBien(data ?? []);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId, newTask.client_id]);

  useEffect(() => {
    defaultStartTimeRef.current.setHours(7);
    defaultStartTimeRef.current.setMinutes(0);
    defaultEndTimeRef.current.setHours(18);
    defaultEndTimeRef.current.setMinutes(0);
    defaultStartDateRef.current.setHours(
      defaultStartTimeRef.current.getHours()
    );
    defaultStartDateRef.current.setMinutes(
      defaultStartTimeRef.current.getMinutes()
    );
    defaultEndDateRef.current.setHours(defaultEndTimeRef.current.getHours());
    defaultEndDateRef.current.setMinutes(
      defaultEndTimeRef.current.getMinutes()
    );
  }, []);

  useEffect(() => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["start_hour"]:
        props.selectedSlot?.start_hour || defaultStartTimeRef.current,
      ["end_hour"]: props.selectedSlot?.end_hour || defaultEndTimeRef.current,
      ["start_date"]: props.selectedSlot?.start || defaultStartDateRef.current,
      ["end_date"]: props.selectedSlot?.end || defaultEndDateRef.current,
      ["dates"]: [
        dayjs(props.selectedSlot?.start ?? defaultStartDateRef.current),
      ],
    }));
  }, [props.selectedSlot]);

  function handleOpenClient() {
    setDialogOpenClient(false);
  }

  function handleOpenWorker() {
    setDialogOpenWorker(false);
  }

  const handleOpenDialogSteper = () => {
    props.setDialogOpenSteper(true);
  };

  const AddService = (value: any) => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["services"]: [...prevState.services, value],
    }));
  };

  const DeleteService = (value: any) => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["services"]: prevState.services.filter((service: any) => {
        return service.id !== value;
      }),
    }));
  };

  const handleNewImages = useCallback((images: string[], url: string[]) => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["images"]: url,
    }));
  }, []);

  const handleNewFiles = useCallback((files: string[], url: string[]) => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["files"]: url,
    }));
  }, []);

  const handleDeleteImage = async (imgUrl: string[]) => {
    for (const img of imgUrl) {
      const { type, message } = await deleteImageForNewTask(img, "task");
      if (type === "error") {
        toast.error(message);
        return;
      }
      toast.success(props.tranlateObj.delete_image);
    }
  };

  const handleAbort = async (isTrue: boolean) => {
    isTrue && (await handleDeleteImage(newTask.images));
    setNewTask({
      title: "",
      description: "",
      address: "",
      status: "in_progress",
      priority: "",
      client_id: "",
      cost: "",
      long: 0.0,
      lattitude: 0.0,
      start_date: props.selectedSlot?.start
        ? props.selectedSlot?.start
        : defaultStartDateRef.current,
      end_date: props.selectedSlot?.end
        ? props.selectedSlot?.end
        : defaultEndDateRef.current,
      task_type: "hours",
      start_hour: defaultStartTimeRef.current,
      end_hour: defaultEndTimeRef.current,
      depend_on_id: null,
      selected_products_out_stock: [],
      selected_products_in_stock: [],
      workers: [],
      services: [],
      color: "#00acc1",
      profit_net: 0,
      selling_price: 0,
      files: [],
      images: [],
      bien_id: null,
    });
    setProperty(false);
    setImagesBlob([]);
    setFilesBlob([]);
    setAddress("");
    setSelected_products_in_stock([]);
    setSelected_products_out_stock([]);
    props.setDialogOpenSteper(false);
    dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
  };

  const onSelectStudents = (value: any[]) => {
    if (value) {
      setNewTask({ ...newTask, ["students"]: value });
    }
  };

  const onSubmitMultipleTask = async (date: any, isLast: boolean) => {
    const start_hours = new Date(newTask.start_hour).getHours();
    const start_minutes = new Date(newTask.start_hour).getMinutes();
    const end_hours = new Date(newTask.end_hour).getHours();
    const end_minutes = new Date(newTask.end_hour).getMinutes();

    let start_date = new Date(date);
    start_date.setHours(start_hours);
    start_date.setMinutes(start_minutes);

    let end_date = new Date(date);
    end_date.setHours(end_hours);
    end_date.setMinutes(end_minutes);

    console.log("start_date ___ ", start_date, "end_date -----", end_date);

    const returnvalue = taskSchema.safeParse({
      ...newTask,
      ["lattitude"]: 0,
      ["long"]: 0,
      ["start_hour"]: new Date(newTask.start_hour).getHours(),
      ["end_hour"]: new Date(newTask.end_hour).getHours(),
    });

    console.log(
      "returnvalue",
      returnvalue,
      "start_date",
      newTask.start_date,
      newTask.end_date
    );

    const allData = {
      ...newTask,
      department_id: departmentId,
      selected_products_out_stock: selected_products_out_stock,
      selected_products_in_stock: selected_products_in_stock,
      start_date: start_date,
      end_date: end_date,
    };

    console.log("AllDatta +++++", allData);

    if (returnvalue.success) {
      try {
        const err = await axios.post("/api/task", allData);
        toast.success(props.tranlateObj.submit_success, {
          position: "bottom-right",
        });
        setErrors({});
        dispatch(setAddress(""));
      } catch (error) {
        toast.error(props.tranlateObj.submit_error, {
          position: "bottom-right",
        });
      }
      if (isLast) {
        setImagesBlob([]);
        setNewTask({
          title: "",
          description: "",
          address: "",
          status: "in_progress",
          priority: "",
          client_id: "",
          cost: "",
          long: 0.0,
          lattitude: 0.0,
          start_date: props.selectedSlot?.start
            ? props.selectedSlot?.start
            : defaultStartDateRef.current,
          end_date: props.selectedSlot?.end
            ? props.selectedSlot?.end
            : defaultEndDateRef.current,
          task_type: "hours",
          start_hour: defaultStartTimeRef.current,
          end_hour: defaultEndTimeRef.current,
          depend_on_id: null,
          selected_products_out_stock: [],
          selected_products_in_stock: [],
          workers: [],
          services: [],
          color: "#00acc1",
          profit_net: 0,
          selling_price: 0,
          images: [],
          files: [],
          bien_id: null,
          dates: [],
          students: [],
        });
        setAddress("");
        setSelected_products_in_stock([]);
        setSelected_products_out_stock([]);
        props.setDialogOpenSteper(false);
        dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
      }
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          toast.error(issue.message, {
            position: "bottom-right",
          });
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };

  const onSubmitNew = async () => {
    const returnvalue = taskSchema.safeParse({
      ...newTask,
      ["start_hour"]: new Date(newTask.start_hour).getHours(),
      ["end_hour"]: new Date(newTask.end_hour).getHours(),
    });

    const allData = {
      ...newTask,
      department_id: departmentId,
      selected_products_out_stock: selected_products_out_stock,
      selected_products_in_stock: selected_products_in_stock,
    };

    if (returnvalue.success) {
      try {
        const err = await axios.post("/api/task", allData);
        toast.success(props.tranlateObj.submit_success, {
          position: "bottom-right",
        });
        setErrors({});
        dispatch(setAddress(""));
      } catch (error: any) {
        toast.error(error, {
          position: "bottom-right",
        });
      }

      setNewTask({
        title: "",
        description: "",
        address: address,
        status: "in_progress",
        priority: "low",
        client_id: "",
        cost: "",
        long: 0.0,
        lattitude: 0.0,
        start_date: props.selectedSlot?.start
          ? props.selectedSlot?.start
          : defaultStartDateRef.current,
        end_date: props.selectedSlot?.end
          ? props.selectedSlot?.end
          : defaultEndDateRef.current,
        task_type: "hours",
        start_hour: defaultStartTimeRef.current,
        end_hour: defaultEndTimeRef.current,
        depend_on_id: null,
        selected_products_out_stock: [],
        selected_products_in_stock: [],
        workers: [],
        services: [],
        color: "#00acc1",
        profit_net: 0,
        selling_price: 0,
        files: [],
        images: [],
        bien_id: null,
      });
      setImagesBlob([]);
      setFilesBlob([]);
      setAddress("");
      setProperty(false);
      setSelected_products_in_stock([]);
      setSelected_products_out_stock([]);
      props.setDialogOpenSteper(true);
      dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
    } else {
      setDisable(false);
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          toast.error(issue.message, {
            position: "bottom-right",
          });
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };

  const onSubmit = async () => {
    const returnvalue = taskSchema.safeParse({
      ...newTask,
      ["lattitude"]: 0,
      ["long"]: 0,
      ["start_hour"]: new Date(newTask.start_hour).getHours(),
      ["end_hour"]: new Date(newTask.end_hour).getHours(),
    });

    const allData = {
      ...newTask,
      department_id: departmentId,
      selected_products_out_stock: selected_products_out_stock,
      selected_products_in_stock: selected_products_in_stock,
    };

    if (returnvalue.success) {
      try {
        const err = await axios.post("/api/task", allData);
        toast.success(props.tranlateObj.submit_success, {
          position: "bottom-right",
        });
        setErrors({});
        dispatch(setAddress(""));
      } catch (error: any) {
        toast.error(error, {
          position: "bottom-right",
        });
      }

      setImagesBlob([]);
      setNewTask({
        title: "",
        description: "",
        address: address,
        status: "in_progress",
        priority: "",
        client_id: "",
        cost: "",
        long: 0.0,
        lattitude: 0.0,
        start_date: props.selectedSlot?.start
          ? props.selectedSlot?.start
          : defaultStartDateRef.current,
        end_date: props.selectedSlot?.end
          ? props.selectedSlot?.end
          : defaultEndDateRef.current,
        task_type: "hours",
        start_hour: defaultStartTimeRef.current,
        end_hour: defaultEndTimeRef.current,
        depend_on_id: null,
        selected_products_out_stock: [],
        selected_products_in_stock: [],
        workers: [],
        services: [],
        color: "#00acc1",
        profit_net: 0,
        selling_price: 0,
        images: [],
        files: [],
        bien_id: null,
      });
      setAddress("");
      setSelected_products_in_stock([]);
      setSelected_products_out_stock([]);
      props.setDialogOpenSteper(false);
      dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          toast.error(issue.message, {
            position: "bottom-right",
          });
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };

  const handleMultpleDatePicker = (date: Dayjs[]) => {
    onSubmitMultipleTask(newTask.start_date, date.length === 1);
    for (let i = 0; i < date.length; i++) {
      onSubmitMultipleTask(date[i], i === date.length - 1);
    }
  };

  return (
    <Box>
      {dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}
      {dialogOpenWorker && <CreateWorker openSteper={handleOpenWorker} />}
      <Box>
        {props.showAddButton && (
          <CustumButton
            label={
              <>
                <AddCircleOutlineIcon />
                {props.tranlateObj.Create_Task}
              </>
            }
            onClick={handleOpenDialogSteper}
          />
        )}
      </Box>
      <Dialog
        open={props.dialogOpenSteper}
        onClose={(event) => {
          handleAbort(true);
        }}
        fullScreen
        sx={{
          overscrollBehavior: "contain",
          overflow: "auto",
          overflowY: "auto",
        }}
        autoFocus={true}
      >
        <DialogContent>
          <TextField
            select={true}
            autoFocus={true}
            sx={{
              width: "0%",
              height: "0%",
              opacity: "0",
            }}
          >
            <Select />
          </TextField>
          <Grid container width={"100%"}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "start",
                backgroundColor: "#f5f5f5",
                boxShadow: " 0px 2px 4px rgba(0, 0, 0, 0.2)",
                alignItems: "start",
                height: "4rem",
              }}
              position="fixed"
              top={0}
              left={0}
              right={0}
              zIndex={1000}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "4rem",
                  width: "100%",
                  maxwidth: "850px",
                  padding: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // marginLeft: "1.5rem",
                  }}
                >
                  <Tooltip title="Abort">
                    <IconButton
                      edge="start"
                      sx={{ marginLeft: "1rem" }}
                      color="inherit"
                      aria-label="close"
                      onClick={() => {
                        handleAbort(true);
                      }}
                    >
                      <Close
                        sx={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: theme.palette.primary.main,
                          "&:hover": {
                            color: theme.palette.error.dark,
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.5rem" },
                      fontWeight: "700",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {props.tranlateObj.Creation_Task}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "start",
                    marginRight: "1rem",
                  }}
                ></Box>
              </Box>
            </Grid>
            <Grid
              container
              spacing={2}
              lg={7}
              xs={12}
              md={12}
              marginLeft={{ xs: "0rem", md: "1rem" }}
            >
              <Grid item xs={12} marginTop={"7vh"}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  <ListOutlined
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "2.2rem",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1.1rem",
                      color: "rgba(0, 0, 0, 1)",
                    }}
                  >
                    {props.tranlateObj.New_Task}
                  </Typography>
                </Box>
              </Grid>
              {/* First step, Client & address*/}
              <Grid item md={12} xs={12} marginTop={"1rem"}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "start" }}>
                    <Typography
                      sx={{
                        fontWeight: 650,
                        fontSize: "1rem",
                        color: "rgba(0, 0, 0, 1)",
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      1. {props.tranlateObj.info_general}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      marginTop: "0rem",
                      marginBottom: "0.3rem",
                      width: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <CreateTaskFirstStep
                    tranlateObj={props.tranlateObj}
                    newTaskData={newTask}
                    setNewTaskData={setNewTask}
                    TaskErrors={errors}
                    NormalDatePicker={false}
                  />
                </Grid>
                <Grid item xs={12} marginTop={"1rem"}>
                  <SelectClient
                    tranlateObj={props.tranlateObj}
                    setNewTask={setNewTask}
                    newTask={newTask}
                    clients={clients}
                    setDialogOpenClient={setDialogOpenClient}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} marginTop={"1rem"}>
                  <Grid container display={"flex"} width={"100%"} spacing={1}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        width: "100%",
                      }}
                    >
                      <CustumButton
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          width: "100%",
                          maxWidth: "300px",
                        }}
                        label={props.tranlateObj.select_property}
                        onClick={() => {
                          setNewAdd(false);
                          setProperty(true);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "end",
                        width: "100%",
                      }}
                    >
                      <CustumButton
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          width: "100%",
                          maxWidth: "300px",
                        }}
                        label={props.tranlateObj.select_from_map}
                        onClick={() => {
                          setNewAdd(true);
                          setProperty(false);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} marginTop={"1rem"}>
                  {property && (
                    <Grid container display={"flex"} width={"100%"} spacing={1}>
                      <Grid
                        item
                        xs={12}
                        md={2.7}
                        sx={{
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "start",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: "#222222",
                            display: "flex",
                            alignItems: "end",
                            width: "100%",
                          }}
                        >
                          {props.tranlateObj.select_property}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        md={6.8}
                        marginTop={"0rem"}
                        width={"100%"}
                        flexDirection={"column"}
                        position={"relative"}
                      >
                        <BienAutocomplete
                          bien={bien!}
                          translateObj={props.tranlateObj}
                          onChange={(value: any) => {
                            if (value) {
                              console.log("value", value);
                              setNewTask({
                                ...newTask,
                                ["address"]: value.location,
                                ["bien_id"]: value.uid,
                              });
                              setAddress(value.location);
                            }
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={2.5}
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "end",
                          width: "100%",
                        }}
                      >
                        <CreateBien
                          canCreateClient={true}
                          // myClient={{
                          //   uid: newTask.client_id,
                          //   name: newClient.first_name,
                          // } }
                          isOverride={true}
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            maxWidth: "100%",
                          }}
                        >
                          <CustumButton
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              justifySelf: "end",
                              width: "100%",
                              maxWidth: "300px",
                              padding: "6px",
                            }}
                            label={
                              <>
                                <AddCircleOutlineIcon />
                                {props.tranlateObj.add_new_property}
                              </>
                            }
                            onClick={handleOpenWorker}
                          />
                        </CreateBien>
                      </Grid>
                    </Grid>
                  )}
                  {newAdd && (
                    <Grid container display={"flex"} width={"100%"} spacing={1}>
                      <Grid
                        item
                        xs={12}
                        md={2.5}
                        sx={{
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "start",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: "#222222",
                            display: "flex",
                            alignItems: "end",
                            width: "100%",
                          }}
                        >
                          {props.tranlateObj.address}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={9.5}
                        marginTop={"0rem"}
                        width={"100%"}
                        flexDirection={"column"}
                        position={"relative"}
                      >
                        <TextField
                          ref={textFieldRef}
                          autoFocus={false}
                          margin="dense"
                          hiddenLabel
                          type="text"
                          name="address"
                          placeholder={props.tranlateObj.address}
                          value={address}
                          onChange={handleAddressChange}
                          onKeyDown={handleKeyPress}
                          sx={{
                            width: "100%",
                            position: "relative",
                          }}
                          variant="standard"
                        />
                        {suggestions.length > 0 && (
                          <List
                            component="nav"
                            style={{
                              maxHeight: "190px",
                              overflowY: "auto",
                              backgroundColor: "#F9F9F9",
                              zIndex: 500,
                              width: "100%",
                              top: "100%",
                              height: "auto",
                              position: "absolute",
                              border: "1px solid #E0E0E0",
                              borderRadius: "0.3rem",
                            }}
                          >
                            {suggestions.map((suggestion: any, index) => (
                              <ListItem
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "#BDC4CF",
                                    fontWeight: 700,
                                    color: "#fff",
                                  },
                                }}
                                key={index}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                <ListItemText primary={suggestion.place_name} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                {errors.address && <FormError error={errors.address} />}
                {newAdd && (
                  <Grid item xs={12} marginTop={"1rem"}>
                    <Map
                      latitude={newLatitude}
                      longitude={newLongitude}
                      height={"20rem"}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                spacing={2}
                marginLeft={{ xs: "0rem", md: "1rem" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "1.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1rem",
                      color: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    3. {props.tranlateObj.Teacher_students_info}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginTop: "0.6rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Grid item xs={12}>
                  <SelectEnseignant
                    tranlateObj={props.tranlateObj}
                    Enseignants={workers}
                    onSelectEnseignant={(value: any) => {
                      setNewTask({
                        ...newTask,
                        ["workers"]: value,
                      });
                    }}
                    newTask={newTask}
                    errors={errors}
                    setDialogOpenWorker={setDialogOpenWorker}
                  />
                </Grid>
                <Grid item xs={12} marginTop={"0rem"}>
                  <Grid container display={"flex"} width={"100%"} spacing={1}>
                    <Grid item xs={12} md={2.7}>
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "1.5rem",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "#222222",
                            display: "flex",
                            alignItems: "end",
                          }}
                        >
                          {props.tranlateObj.Select_students}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} md={9.3}>
                      <MultiAutocompleteWorkers
                        label=""
                        placeholder={props.tranlateObj.Select_students}
                        workers={students}
                        defaultValue={newTask.students}
                        onSelectedValuesChange={onSelectStudents}
                        variant="standard"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} marginTop={"0rem"}>
                  <Selectstatus
                    tranlateObj={props.tranlateObj}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} marginTop={"0rem"}>
                  <SelectPriority
                    tranlateObj={props.tranlateObj}
                    newTask={newTask}
                    priority={newTask.priority}
                    setNewTask={setNewTask}
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                marginLeft={{ xs: "0rem", md: "1rem" }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "2rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1rem",
                      color: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    4. {props.tranlateObj.consumubles_services}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginTop: "0.6rem",
                    marginBottom: "0.2rem",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Grid item xs={12} marginTop={"0rem"}>
                  <Grid container display={"flex"} width={"100%"} spacing={1}>
                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "1.5rem",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: "#222222",
                            display: "flex",
                            alignItems: "end",
                            width: "100%",
                          }}
                        >
                          {props.tranlateObj.consumables_From_Stock}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"end"}
                      width={"100%"}
                      flexDirection={"column"}
                    >
                      <ProductsSelecter
                        products={products}
                        addedProducts={selected_products_in_stock}
                        onChange={(value: any) => {
                          setSelected_products_in_stock(value);
                        }}
                        tranlateObj={props.tranlateObj}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      display={"flex"}
                      justifyContent={{ xs: "start", md: "end" }}
                      alignItems={{ xs: "start", md: "end" }}
                      width={"100%"}
                    >
                      <CustumButton
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 550,
                          width: "100%",
                          textTransform: "none",
                          color: "#fff",
                          backgroundColor: theme.palette.primary.main,
                        }}
                        label={
                          <>
                            {" "}
                            <AddCircleOutlineIcon />{" "}
                            {props.tranlateObj.Add_Product}
                          </>
                        }
                        onClick={() => {}}
                      />
                    </Grid>
                    {selected_products_in_stock && (
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "start" }}>
                          <ProductList
                            currency={currencySymbol}
                            products={selected_products_in_stock}
                            onDelete={(uid: string) => {
                              const newProducts =
                                selected_products_in_stock.filter(
                                  (product) => product.uid !== uid
                                );
                              setSelected_products_in_stock(newProducts);
                            }}
                          />
                        </Box>
                      </Grid>
                    )}
                    {errors.products && <FormError error={errors.products} />}
                  </Grid>
                </Grid>
                <Grid item xs={12} marginTop={"1rem"} marginBottom={"0.5rem"}>
                  <Grid container display={"flex"} width={"100%"} spacing={1}>
                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "1.5rem",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: "#222222",
                            display: "flex",
                            alignItems: "end",
                          }}
                        >
                          {props.tranlateObj.consumables_out_the_stock}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"end"}
                      width={"100%"}
                      flexDirection={"column"}
                    >
                      <ProductsSelecter
                        products={productsOutStock}
                        onChange={(value: any) => {
                          setSelected_products_out_stock(value);
                        }}
                        tranlateObj={props.tranlateObj}
                        addedProducts={selected_products_out_stock}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      display={"flex"}
                      justifyContent={{ xs: "start", md: "end" }}
                      alignItems={{ xs: "start", md: "end" }}
                      width={"100%"}
                    >
                      <CustumButton
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 550,
                          width: "100%",
                          textTransform: "none",
                          color: "#fff",
                          backgroundColor: theme.palette.primary.main,
                        }}
                        label={
                          <>
                            {" "}
                            <AddCircleOutlineIcon />{" "}
                            {props.tranlateObj.Add_Product}
                          </>
                        }
                        onClick={() => {}}
                      />
                    </Grid>
                    {selected_products_out_stock && (
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "start" }}>
                          <ProductList
                            currency={currencySymbol}
                            products={selected_products_out_stock}
                            onDelete={(uid) => {
                              setSelected_products_out_stock((prevProducts) => {
                                const newProducts = prevProducts.filter(
                                  (product) => product.uid !== uid
                                );
                                return newProducts;
                              });
                            }}
                          />
                        </Box>
                      </Grid>
                    )}
                    {errors.products && <FormError error={errors.products} />}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                marginLeft={{ xs: "0rem", md: "1rem" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "1.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1rem",
                      color: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    5. {props.tranlateObj.dependecy}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginTop: "0.6rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Grid item xs={12} md={2.7}>
                  <Box
                    sx={{
                      display: "flex",
                      marginTop: "1.6rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "1rem",
                        color: "#222222",
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      {props.tranlateObj.dependecy}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={9.3}
                  sx={{
                    marginBottom: "1rem",
                  }}
                >
                  <Autocomplete
                    autoFocus={false}
                    options={tasks}
                    value={
                      newTask
                        ? tasks.find(
                            (task: any) => task.uid === newTask.depend_on_id
                          )
                        : null
                    }
                    getOptionLabel={(option: any) => option.title}
                    onChange={(event, selectedChoice) => {
                      setNewTask((prevState: any) => ({
                        ...prevState,
                        ["depend_on_id"]: selectedChoice?.uid
                          ? selectedChoice?.uid
                          : null,
                      }));
                    }}
                    id="depen-on"
                    autoSelect
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        placeholder={props.tranlateObj.dependecy}
                        variant="standard"
                      />
                    )}
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>
                {errors.depend_on && <FormError error={errors.depend_on} />}
              </Grid>
              <Grid
                container
                spacing={2}
                marginLeft={{ xs: "0rem", md: "1rem" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "2rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1rem",
                      color: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    6. {props.tranlateObj.price_summary}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />

                <Grid item xs={12}>
                  <SellingPrice
                    translateObj={props.tranlateObj}
                    client_id={newTask.client_id}
                    bien_id={newTask.bien_id}
                    departement_id={departmentId}
                    onAddOption={AddService}
                    onDeleteOption={DeleteService}
                    workingHours={
                      new Date(newTask.end_hour)?.getHours() -
                      new Date(newTask.start_hour)?.getHours()
                    }
                  />
                  {errors.price && <FormError error={errors.price} />}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                marginLeft={{ xs: "0rem", md: "1rem" }}
                marginTop={"1rem"}
                width={"100%"}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 650,
                      fontSize: "1rem",
                      color: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    7. {props.tranlateObj.Attachments}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />

                <Grid item xs={12}>
                  <NewTaskImages
                    images={imagesBlob}
                    setImages={setImagesBlob}
                    ChangeImages={handleNewImages}
                    folder="task"
                    table="Task"
                  />
                </Grid>

                <Grid item xs={12}>
                  <ListFilesForNewTask
                    files={filesBlob}
                    setFiles={setFilesBlob}
                    ChangeFiles={handleNewFiles}
                    folder="Task"
                  />
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginTop: "1.5rem",
                }}
              >
                <EstimatedPrice
                  currency={currencySymbol}
                  worker_salary={newTask?.workers}
                  products_out_stock={selected_products_out_stock}
                  products_in_stock={selected_products_in_stock}
                  task={newTask}
                  onEstimateChange={(
                    task_cost: number,
                    services_cost: number
                  ) => {
                    setNewTask({
                      ...newTask,
                      ["cost"]: task_cost,
                      ["selling_price"]: services_cost,
                      ["profit_net"]: services_cost - task_cost,
                    });
                  }}
                />
              </Grid>

              <Grid
                container
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
                spacing={1}
                marginTop={"1.2rem"}
              >
                <Grid item xs={6} md={4}>
                  <DatePickerModal
                    tranlateObj={props.tranlateObj}
                    onChange={handleMultpleDatePicker}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <CustumButton
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      width: "100%",
                      maxWidth: "300px",
                    }}
                    disabled={disable}
                    label={props.tranlateObj.save}
                    onClick={() => {
                      onSubmit();
                      setDisable(true);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignItems={"end"}
                >
                  <CustumButton
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      width: "100%",
                      maxWidth: "300px",
                    }}
                    disabled={disable}
                    label={props.tranlateObj.save_and_new}
                    onClick={() => {
                      onSubmitNew();
                      setDisable(true);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              md={5}
              lg={5}
              xs={12}
              justifyContent={"center"}
              display={{
                xs: "none",
                lg: "flex",
              }}
              sx={{
                width: { md: "fit-content", lg: "100%" },
                maxWidth: "350px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              <VerticalLinearStepper />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
