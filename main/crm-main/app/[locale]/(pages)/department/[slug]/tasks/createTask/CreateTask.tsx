"use client";
import { getCurrency } from "@/app/api/settings/actions/getCurrency";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { TabSelect } from "@/components/ui/OldTabSelect/TabSelect";
import { TabSelectTask } from "@/components/ui/TabSelect/TabSelectTask";
import { RootState } from "@/store";
import { setAddress } from "@/store/addressSlice";
import { backStep } from "@/store/steperslice";
import theme from "@/styles/theme";
import { taskSchema } from "@/utils/schemas/task/taskSchema";
import { createClient } from "@/utils/supabase/client";
import { fetchClients } from "@/utils/supabase/fetchClients";
import { fetchWorkers } from "@/utils/supabase/fetchWorkers";
import { Close, ListOutlined } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import CurrencyList from "currency-list";
import type { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateBien from "../../biens/CreateBien";
import CreateClient from "../../clients/CreateClient";
import CreateProduct from "../../products/CreateProduct";
import CreateStock from "../../stock/CreateStock";
import CreateWorker from "../../workers/CreateWorker";
import {
  deleteFileForNewTask,
  deleteImageForNewTask,
} from "../[taskId]/TaskImages/actions";
import NewTaskImages from "../[taskId]/TaskImages/NewTaskImages";
import BienAutocomplete from "../components/BienAutocomplete";
import EstimatedPrice from "../components/EstimatedPrice";
import { MultiAutocompleteWorkers } from "../components/MultiAutocompleteWorkers";
import ListFilesForNewTask from "../components/NewTaskFiles";
import ProductList from "../components/ProductPreview";
import SellingPrice from "../components/SellingPrice";
import VerticalLinearStepper from "../components/verticalStepper";
import CreateTaskFirstStep from "./CreateTaskFirstStep";
import {
  DeleteTaskDraft,
  getBien,
  getData,
  getProductsInStockForTask,
  getProductsOutOfStockForTask,
  getTaskDraft,
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

export type Workers_salary = {
  salary_hour: number;
  salary_day: number;
  worker_name: string;
};

export default function CreateTask(props: props) {
  const supabase = createClient();
  const dispatch = useDispatch();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const address = useSelector(
    (state: RootState) => state?.addressReducer?.address
  );
  const userId = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.id
  );
  const defaultStartTimeRef = useRef(new Date());
  const defaultEndTimeRef = useRef(new Date());
  const defaultStartDateRef = useRef(new Date());
  const defaultEndDateRef = useRef(new Date());
  const textFieldRef = useRef(null);
  const [taskDraft, setTaskDraft] = useState<any>([]);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [newBien, setNewBien] = useState<any>();
  const [productsOutStock, setProductsOutStock] = useState<any>([]);
  const [selected_products_out_stock, setSelected_products_out_stock] =
    useState<any[]>([]);
  const [selected_products_in_stock, setSelected_products_in_stock] = useState<
    any[]
  >([]);
  const [newWorker, setNewWorker] = useState<any>();
  const [newClient, setNewClient] = useState<any>();
  const [products, setProducts] = useState<any>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<any>([]);
  const [workers, setWorkers] = useState<any>([]);
  const [draftclients, setDraftclients] = useState<any>([]);
  const [draftworkers, setDraftworkers] = useState<any>([]);
  const [
    selected_draft_products_in_stock,
    setSelected_draft_products_in_stock,
  ] = useState<any[]>([]);
  const [
    selected_draft_products_out_stock,
    setSelected_draft_products_out_stock,
  ] = useState<any[]>([]);
  const [priority, setPriority] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dialogOpenClient, setDialogOpenClient] = useState(false);
  const [dialogOpenWorker, setDialogOpenWorker] = useState(false);
  const [dialogOpenStock, setDialogOpenStock] = useState(false);
  const [dialogOpenProduct, setDialogOpenProduct] = useState(false);
  const [property, setProperty] = useState(false);
  const [newAdd, setNewAdd] = useState(false);
  const [bien, setBien] = useState<any[]>([]);
  const [newLatitude, setnewLatitude] = useState(48.8588897);
  const [newLongitude, setLongitude] = useState(2.3200410217200766);
  const [statusNames, setStatusNames] = useState<any[]>([]);
  const [currencyConfig, setCurrencyConfig] = useState({
    locale: "Europe",
    currency: "EUR",
  });
  const [tasks, setTasks] = useState<any>([]);
  const [disable, setDisable] = useState(false);
  const [imagesBlob, setImagesBlob] = useState<any>([]);
  const [filesBlob, setFilesBlob] = useState<any>([]);
  const [newProduct, setNewProduct] = useState<any>();
  const [dependencyDraft, setDependencyDraft] = useState<any>();
  const [newTask, setNewTask] = useState<any>({
    title: "",
    description: "",
    address: "",
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
    images: [],
    files: [],
    bien_id: null,
  });
  const [currencySymbol, setCurrencySymbol] = useState<string>("");

  useEffect(() => {
    setWorkers((prevWorkers: any) => {
      const newWorkers = [...prevWorkers, newWorker];
      console.log("Updated workers list:", newWorkers);
      return newWorkers;
    });
  }, [newWorker]);

  useEffect(() => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["address"]: address,
    }));
  }, [address]);

  useEffect(() => {
    setBien((prevBien: any) => {
      const newBiens = [...prevBien, newBien];
      console.log("Updated bien list:", newBiens);
      return newBiens;
    });
  }, [newBien]);

  useEffect(() => {
    setClients((prevClients: any) => {
      const newClients = [...prevClients, newClient];
      console.log("Updated clients list:", newClients);
      return newClients;
    });
    console.log("newClient", newClient);
  }, [newClient]);

  useEffect(() => {
    if (newProduct) {
      if (newProduct.stock_id !== null) {
        setProducts((prevProducts: any) => {
          const newProducts = [...prevProducts, newProduct];
          console.log("Updated products list:", newProducts);
          return newProducts;
        });
      } else {
        setProductsOutStock((prevProducts: any) => {
          const newProducts = [...prevProducts, newProduct];
          console.log("Updated products list:", newProducts);
          return newProducts;
        });
      }
    }
  }, [newProduct]);

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

  const handleDeleteFiles = async (filesUrl: string[]) => {
    for (const file of filesUrl) {
      const { type, message } = await deleteFileForNewTask(file, "task");
      if (type === "error") {
        toast.error(message);
        return;
      }
      toast.success(message, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setNewTask((prevState: any) => ({
      ...prevState,
      ["start_hour"]:
        props.selectedSlot?.start_hour || defaultStartTimeRef.current,
      ["end_hour"]: props.selectedSlot?.end_hour || defaultEndTimeRef.current,
      ["start_date"]: props.selectedSlot?.start || defaultStartDateRef.current,
      ["end_date"]: props.selectedSlot?.end || defaultEndDateRef.current,
    }));
  }, [props.selectedSlot]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCurrency(departmentId);
      if (!data?.error) {
        setCurrencyConfig({
          locale: data?.success?.currency,
          currency: data?.success?.currency,
        });
      } else {
        toast(props.tranlateObj.error_fetching, {
          position: "bottom-right",
        });
      }
    };
    if (departmentId) fetchData();
  }, [departmentId, props.tranlateObj.error_fetching]);

  useEffect(() => {
    setStatusNames([
      props.tranlateObj.in_progress,
      props.tranlateObj.done,
      props.tranlateObj.pending,
      props.tranlateObj.delayed,
    ]);
    const getLocation = () => {
      if (!navigator.geolocation) {
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setnewLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {}
      );
    };
    getLocation();
  }, [props.tranlateObj]);

  const handleContinueDraft = () => {
    setShowDraftPrompt(false);
    props.setDialogOpenSteper(true);
    setNewTask({
      ...taskDraft,
      start_date: taskDraft.start_date
        ? new Date(taskDraft.start_date)
        : new Date(defaultStartDateRef.current),
      end_date: taskDraft.end_date
        ? new Date(taskDraft.end_date)
        : new Date(defaultEndDateRef.current),
      start_hour: taskDraft.start_hour
        ? new Date(taskDraft.start_hour)
        : new Date(defaultStartTimeRef.current),
      end_hour: taskDraft.end_hour
        ? new Date(taskDraft.end_hour)
        : new Date(defaultEndTimeRef.current),
    });
    setSelected_products_in_stock(selected_draft_products_in_stock);
    setSelected_products_out_stock(selected_draft_products_out_stock);
  };

  const handleDiscardDraft = async () => {
    setShowDraftPrompt(false);
    setTaskDraft([]);
    setDraftworkers([]);
    setDraftclients([]);
    setSelected_draft_products_in_stock([]);
    setSelected_draft_products_out_stock([]);
    DeleteTaskDraft(taskDraft.uid).then(() => {
      console.log("Draft deleted");
    });
    await handleDeleteImage(taskDraft.images);
    await deleteFileForNewTask(taskDraft.files, "task");
  };

  useEffect(() => {
    if (departmentId) {
      getTaskDraft(departmentId, userId!)
        .then((data) => {
          if (data) {
            const { task, draftWorkers, draftStudents, draftClient } = data;
            setTaskDraft(task ?? []);
            setDraftworkers(draftWorkers ?? []);
            setDraftclients(draftClient ?? []);
            setSelected_draft_products_in_stock(
              task?.selected_products_in_stock ?? []
            );
            setSelected_draft_products_out_stock(
              task?.selected_products_out_stock
                ? task?.selected_products_out_stock
                : []
            );
            setDependencyDraft(task.depend_on_id);
            setNewTask((prevState: any) => ({
              ...prevState,
              ["depend_on_id"]: task.depend_on_id,
            }));
            setFilesBlob(task?.files!);
            setImagesBlob(task?.images!);
            setShowDraftPrompt(true);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId, userId, tasks]);

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
    if (departmentId) {
      const clientChannel = supabase
        .channel("realtime:client_statusX")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "client_department",
            filter: "department_id=eq." + departmentId,
          },
          async (payload) => {
            console.log("payload______5145____________", payload);
            if (payload.eventType === "INSERT") {
              const data = await fetchClients(payload.new.client_id);
              console.log("data", data);
              if (data) {
                setNewClient(data);
                // setClients((prevClients: any) => [...prevClients, data]);
              }
            }
          }
        )
        .subscribe();

      return () => {
        clientChannel.unsubscribe();
      };
    }
  }, [supabase, departmentId]);

  useEffect(() => {
    const ProductChannel = supabase
      .channel("realtime:Product_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Product",
          filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.department_id === departmentId
          ) {
            setNewProduct(payload.new);
          }
        }
      )
      .subscribe();
    return () => {
      ProductChannel.unsubscribe();
    };
  }, [departmentId, supabase]);

  useEffect(() => {
    const BienChannel = supabase
      .channel("realtime:Bien_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bien",
          filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("payload______2025____________", payload);
            setNewBien(payload.new);
          }
        }
      )
      .subscribe();
    return () => {
      BienChannel.unsubscribe();
    };
  }, [departmentId, supabase]);

  useEffect(() => {
    const workerChannel = supabase
      .channel("realtime:user_worker_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "department_user_worker",
          filter: "department_id=eq." + departmentId,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const data = await fetchWorkers(payload.new.user_worker_id);
            console.log("data____2024____ ::: ", data);
            if (data) {
              setNewWorker({
                uid: data.uid,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                status: data.status,
                id: data.id ?? 0,
                salary_day: data.salary_day,
                salary_hour: data.salary_hour,
                profile_picture: data.avatar,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      workerChannel.unsubscribe();
    };
  }, [departmentId, supabase]);

  const handleOpenDialogSteper = () => {
    props.setDialogOpenSteper(true);
  };

  const handleCloseDialogSteper = () => {
    setImagesBlob([]);
    setFilesBlob([]);
    setProperty(false);
    props.setDialogOpenSteper(false);
  };

  const handleChangePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
    setNewTask((prevState: any) => ({
      ...prevState,
      ["priority"]: event.target.value,
    }));
    dispatch({ payload: 4, type: "VerticalSteperSlice/setActiveStep" });
  };

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

  const onSelectWorker = (value: any[]) => {
    if (value) {
      setNewTask({ ...newTask, ["workers"]: value });
    }
  };

  const onSelectClient = (value: any | null) => {
    if (value) {
      setNewTask({ ...newTask, ["client_id"]: value.uid });
    }
  };

  const status_arr = [
    { value: "in_progress", label: props.tranlateObj.in_progress },
    { value: "done", label: props.tranlateObj.done },
    { value: "pending", label: props.tranlateObj.pending },
    { value: "delayed", label: props.tranlateObj.delayed },
  ];

  const onSelectStatus = (value: string | null) => {
    if (value) {
      const index = status_arr.findIndex((status) => status.label === value);
      setNewTask({ ...newTask, ["status"]: status_arr[index].value });
      console.log("status_arr[index].value", status_arr[index].value);
    }
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
        dispatch(backStep());
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
      setPriority("");
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

  useEffect(() => {
    setDisable(false);
  }, [newTask]);

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
      setPriority("");
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

  const handleAbort = async (isTrue: boolean) => {
    if (isTrue) {
      newTask.images && (await handleDeleteImage(newTask.images));
      if (newTask?.files) {
        handleDeleteFiles(newTask.files);
      }
    }
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
      files: [],
      images: [],
      bien_id: null,
    });
    setProperty(false);
    setImagesBlob([]);
    setFilesBlob([]);
    setAddress("");
    setPriority("");
    setSelected_products_in_stock([]);
    setSelected_products_out_stock([]);
    props.setDialogOpenSteper(false);
    dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
  };

  function handleOpenClient() {
    props.setDialogOpenSteper(true);
    setDialogOpenClient(false);
  }

  function handleOpenWorker() {
    props.setDialogOpenSteper(true);
    setDialogOpenWorker(false);
  }

  const handleOpenProduct = () => {
    setDialogOpenProduct(true);
  };

  const handleMultpleDatePicker = (date: Dayjs[]) => {
    onSubmitMultipleTask(newTask.start_date, date.length === 1);
    for (let i = 0; i < date.length; i++) {
      onSubmitMultipleTask(date[i], i === date.length - 1);
    }
  };

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
        dispatch(backStep());
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
        setPriority("");
        setSelected_products_in_stock([]);
        setSelected_products_out_stock([]);
        props.setDialogOpenSteper(false);
        dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
      }
    } else {
      setDisable(false);
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          toast.error(issue.message, {
            position: "bottom-right",
          });
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

  const onSubmitDraft = async () => {
    const start_hours = new Date(newTask.start_hour).getHours();
    const start_minutes = new Date(newTask.start_hour).getMinutes();
    const end_hours = new Date(newTask.end_hour).getHours();
    const end_minutes = new Date(newTask.end_hour).getMinutes();
    const start_date = new Date(newTask.start_date);
    start_date.setHours(start_hours);
    start_date.setMinutes(start_minutes);
    const end_date = new Date(newTask.end_date);
    end_date.setHours(end_hours);
    end_date.setMinutes(end_minutes);
    const draftTask = {
      ...newTask,
      ["lattitude"]: 0,
      ["long"]: 0,
      ["start_hour"]: new Date(newTask.start_hour),
      ["end_hour"]: new Date(newTask.end_hour),
      ["start_date"]: new Date(start_date),
      ["end_date"]: new Date(end_date),
    };

    const allData = {
      ...draftTask,
      department_id: departmentId,
      selected_products_out_stock: selected_products_out_stock,
      selected_products_in_stock: selected_products_in_stock,
      user_id: userId,
    };

    try {
      const response = await axios.post("/api/task-draft", allData);
      dispatch(backStep());
      toast.success(props.tranlateObj.draft_success, {
        position: "bottom-right",
      });
      setErrors({});
      dispatch(setAddress(""));
    } catch (error) {
      toast.error(props.tranlateObj.draft_error, {
        position: "bottom-right",
      });
    }

    setImagesBlob([]);
    setNewTask({
      title: "",
      description: "",
      address: address,
      status: "draft", // Set default status for a draft
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
    setPriority("");
    setSelected_products_in_stock([]);
    setSelected_products_out_stock([]);
    props.setDialogOpenSteper(false);
    dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
  };

  return (
    <Box>
      {dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}
      {dialogOpenWorker && <CreateWorker openSteper={handleOpenWorker} />}
      {dialogOpenStock && (
        <CreateStock
          open={dialogOpenStock}
          onClose={() => {
            setDialogOpenStock(false);
          }}
        />
      )}
      {dialogOpenProduct && (
        <CreateProduct
          open={dialogOpenProduct}
          handleClose={() => {
            setDialogOpenProduct(false);
          }}
        />
      )}
      <Dialog
        open={props.dialogOpenSteper}
        onClose={(event) => {
          handleCloseDialogSteper();
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
                        handleCloseDialogSteper;
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
                >
                  <CustumButton
                    style={{
                      width: "100%",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.8rem",
                    }}
                    label={props.tranlateObj.Save_as_Draft}
                    onClick={onSubmitDraft}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid container spacing={2} marginLeft={{ xs: "0rem", md: "1rem" }}>
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
              <Grid item md={12} lg={7} xs={12} marginTop={"1rem"}>
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
                  />
                </Grid>

                <Grid item xs={12} marginTop={"1rem"}>
                  {/* Select client section */}
                  <Grid item xs={12} marginBottom={"1.5rem"}>
                    <Grid
                      container
                      display={"flex"}
                      width={"100%"}
                      spacing={1}
                      marginTop={"0.5rem"}
                    >
                      <Grid item xs={12} md={2.4}>
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
                            {props.tranlateObj.Select_Client}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} md={7.1}>
                        <TabSelectTask
                          departement_id={departmentId}
                          itemsList={clients}
                          default={
                            newTask.client_id !== ""
                              ? clients.find(
                                  (client: any) =>
                                    client.uid === newTask.client_id
                                )
                              : null
                          }
                          onSelect={onSelectClient}
                          placeholder={props.tranlateObj.client}
                          variant="standard"
                          label=""
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        md={2.5}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <CustumButton
                            onClick={() => {
                              setDialogOpenClient(true);
                            }}
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 550,
                              width: "100%",
                              textTransform: "none",
                              color: "#fff",
                              backgroundColor: theme.palette.primary.main,
                              maxHeight: "2.6rem",
                            }}
                            label={
                              <>
                                <AddCircleOutlineIcon />
                                {props.tranlateObj.Add_Client}
                              </>
                            }
                          />
                        </Box>
                      </Grid>

                      {errors.client_id && (
                        <Grid item xs={12}>
                          <FormError error={errors.client_id} />{" "}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  {/* Select client section  */}
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

                {/* worker status info  */}
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
                    3. {props.tranlateObj.worker_info}
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
                <Grid item xs={12} width={"100%"}>
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
                          {props.tranlateObj.Select_Worker}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} md={6.8}>
                      <MultiAutocompleteWorkers
                        label=""
                        placeholder="Select Worker"
                        workers={workers}
                        defaultValue={newTask.workers}
                        onSelectedValuesChange={onSelectWorker}
                        variant="standard"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      md={2.5}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CustumButton
                          onClick={() => {
                            setDialogOpenWorker(true);
                          }}
                          style={{
                            fontSize: "0.6522rem",
                            fontWeight: 550,
                            width: "100%",
                            textTransform: "none",
                            color: "#fff",
                            backgroundColor: theme.palette.primary.main,
                            maxHeight: "2.6rem",
                          }}
                          label={
                            <>
                              <AddCircleOutlineIcon />
                              {props.tranlateObj.Add_Worker}
                            </>
                          }
                        />
                      </Box>
                    </Grid>

                    {errors.workers && (
                      <Grid item xs={12}>
                        {" "}
                        <FormError error={errors.workers} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container display={"flex"} width={"100%"} spacing={1}>
                    <Grid item md={2.7} xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          marginTop: "1.6rem",
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
                          {props.tranlateObj.status}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={9.3}>
                      <TabSelect
                        default={
                          newTask.status
                            ? status_arr.find(
                                (status: any) => status.value === newTask.status
                              )?.label!
                            : status_arr.find(
                                (status: any) => status.value === "in_progress"
                              )?.label!
                        }
                        itemsList={statusNames}
                        onSelect={onSelectStatus}
                        placeholder={props.tranlateObj.status}
                        variant="standard"
                      />
                    </Grid>

                    {errors.status && (
                      <Grid item xs={12}>
                        {" "}
                        <FormError error={errors.status} />
                      </Grid>
                    )}

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
                          {props.tranlateObj.priority}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={9.3}>
                      <FormControl
                        focused={false}
                        fullWidth
                        sx={{
                          marginTop: 1,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Select
                          autoFocus={false}
                          id="demo-simple-select-helper"
                          margin="dense"
                          name="priority"
                          value={priority ? priority : "low"}
                          defaultValue={
                            newTask.priority ? newTask.priority : "low"
                          }
                          onChange={handleChangePriority}
                          variant="standard"
                          sx={{
                            width: "100%",
                          }}
                        >
                          <MenuItem disabled value="">
                            <em>{props.tranlateObj.priority}</em>
                          </MenuItem>

                          <MenuItem value={"low"}>
                            {props.tranlateObj.low}
                          </MenuItem>
                          <MenuItem value={"medium"}>
                            {props.tranlateObj.medium}
                          </MenuItem>
                          <MenuItem value={"high"}>
                            {props.tranlateObj.high}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {errors.priority && (
                      <Grid item xs={12}>
                        {" "}
                        <FormError error={errors.priority} />
                      </Grid>
                    )}

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

                    <Grid
                      item
                      xs={12}
                      width={"100%"}
                      display={"flex"}
                      justifyContent={"end"}
                      alignItems={"end"}
                    >
                      <Grid
                        container
                        display={"flex"}
                        width={"100%"}
                        spacing={1}
                      >
                        <Grid item xs={12} md={9}>
                          <Box></Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.9}
                          display={"flex"}
                          justifyContent={"end"}
                          alignItems={"end"}
                          width={"100%"}
                        >
                          <CustumButton
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 550,
                              width: "83%",
                              textTransform: "none",
                              color: "#fff",
                              backgroundColor: theme.palette.primary.main,
                            }}
                            label={
                              <>
                                {" "}
                                <AddCircleOutlineIcon />{" "}
                                {props.tranlateObj.Add_Stock}
                              </>
                            }
                            onClick={() => {
                              setDialogOpenStock(true);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} marginTop={"0rem"}>
                      <Grid
                        container
                        display={"flex"}
                        width={"100%"}
                        spacing={1}
                      >
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
                        {/* call the product add component */}
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
                            onClick={handleOpenProduct}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {selected_products_in_stock.length > 0 && (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          marginTop: "1rem",
                        }}
                      >
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

                    <Grid
                      item
                      xs={12}
                      marginTop={"1rem"}
                      marginBottom={"0.5rem"}
                    >
                      <Grid
                        container
                        display={"flex"}
                        width={"100%"}
                        spacing={1}
                      >
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
                            onClick={handleOpenProduct}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {errors.products && <FormError error={errors.products} />}

                    {selected_products_out_stock.length > 0 && (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          marginTop: "1rem",
                        }}
                      >
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
                              )!
                            : tasks.find(
                                (task: any) => task.uid === dependencyDraft
                              )!
                        }
                        defaultValue={
                          newTask
                            ? tasks.find(
                                (task: any) => task.uid === newTask.depend_on_id
                              )!
                            : tasks.find(
                                (task: any) => task.uid === dependencyDraft
                              )!
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

                    <SellingPrice
                      alreadyAddedOptions={newTask?.services}
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

                    <Grid item xs={12}>
                      {errors.price && <FormError error={errors.price} />}
                    </Grid>

                    {/* Attachements Sectiion */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
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
                        folder="task"
                      />
                    </Grid>

                    <Box
                      sx={{
                        marginTop: "1.2rem",
                        width: "100%",
                        marginBottom: "1rem",
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
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} marginTop={"1rem"} marginBottom={"2.5rem"}>
                  <Grid
                    container
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    spacing={1}
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
                        label={props.tranlateObj.save_and_new}
                        isDisabled={disable}
                        onClick={() => {
                          onSubmitNew();
                          setDisable(true);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                md={5}
                lg={5}
                xs={12}
                height={"32rem"}
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
          </Grid>
          <Modal
            open={showDraftPrompt}
            onClose={() => setShowDraftPrompt(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-title" variant="h6" component="h2">
                Resume Your Draft Task
              </Typography>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                It looks like you were working on a task titled{" "}
                <strong>{taskDraft?.title}</strong> but didn`&apos`t finish it.
                Would you like to continue where you left off, or start fresh
                with a new task?
              </Typography>
              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
              >
                <Button onClick={handleDiscardDraft} color="secondary">
                  Start New Task
                </Button>
                <Button onClick={handleContinueDraft} color="primary" autoFocus>
                  Continue Draft
                </Button>
              </Box>
            </Box>
          </Modal>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
