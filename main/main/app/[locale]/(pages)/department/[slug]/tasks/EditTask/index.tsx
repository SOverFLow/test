// "use client";
// import { CustumButton } from "@/components/ui/Button/CustumButton";
// import { FormError } from "@/components/ui/FormError/FormError";
// import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
// import { TabSelect } from "@/components/ui/OldTabSelect/TabSelect";
// import { RootState } from "@/store";
// import { backStep } from "@/store/steperslice";
// import theme from "@/styles/theme";
// import { taskSchema } from "@/utils/schemas/task/taskSchema";
// import { Close } from "@mui/icons-material";
// import {
//   Box,
//   Dialog,
//   DialogContent,
//   FormControl,
//   Grid,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   styled,
//   TextField,
//   Tooltip,
// } from "@mui/material";
// import axios from "axios";
// import { useTranslations } from "next-intl";
// import dynamic from "next/dynamic";
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useTransition,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CreateClient from "../../clients/CreateClient";
// import CreateWorker from "../../workers/CreateWorker";
// import {
//   getBien,
//   getData,
//   getProductsInStockForTask,
//   getProductsOutOfStockForTask,
// } from "../createTask/FunctionUtils";

// import { getCurrency } from "@/app/api/settings/actions/getCurrency";
// import { TabSelectTask } from "@/components/ui/TabSelect/TabSelectTask";
// import { setAddress } from "@/store/addressSlice";
// import { createClient } from "@/utils/supabase/client";
// import { ListOutlined } from "@mui/icons-material";
// import { Autocomplete, Button, Divider, Typography } from "@mui/material";
// import { toast } from "react-toastify";
// import CreateProduct from "../../products/CreateProduct";
// import EstimatedPrice from "../components/EstimatedPrice";
// import { MultiAutocompleteWorkers } from "../components/MultiAutocompleteWorkers";
// import ProductList from "../components/ProductPreview";
// import SellingPrice from "../components/SellingPrice";
// import VerticalLinearStepper from "../components/verticalStepper";
// import { Workers_salary } from "../createTask/CreateTask";
// import CreateTaskFirstStep from "../createTask/CreateTaskFirstStep";
// import ProductsSelecter from "../createTask/products";
// import { getTaskData } from "./FunctionUtils";

// const Map = dynamic(() => import("@/components/ui/Map/Map"), {
//   loading: () => <NiceLoading />,
//   ssr: false,
// });

// const StyledInput = styled(TextField)(() => ({
//   "& .MuiInputBase-root": {
//     padding: "0px",
//   },
// }));

// interface props {
//   taskId: number | string;
//   useDialogOpen: [boolean, (value: boolean) => void];
// }

// export default function EditTask(props: props) {
//   const t = useTranslations("AddTaskForm");
//   const tranlateObj = {
//     Task_per_Hours: t("Task per Hours"),
//     Task_per_Days: t("Task per Days"),
//     info_general: t("Information general"),
//     info_location: t("Time and location"), // const t = await getTranslations("Task");
//     consumubles_services: t("Consumubles and services"),
//     worker_info: t("Workers and client info"),
//     price_summary: t("Selling price and summary"),
//     Formtitle: t("Formtitle"),
//     title: t("title"),
//     select_from_map: t("select from map"),
//     description: t("description"),
//     date: t("Task Date"),
//     task_type: t("Task type"),
//     address: t("address"),
//     worker: t("worker"),
//     status: t("status"),
//     client: t("client"),
//     priority: t("priority"),
//     price: t("price"),
//     long: t("long"),
//     lattitude: t("lattitude"),
//     start_date: t("start_date"),
//     end_date: t("end_date"),
//     add_button: t("add_button"),
//     cancel_button: t("cancel_button"),
//     Create_Task: t("Create Task"),
//     New_Task: t("New Task"),
//     dependecy: t("dependency of task"),
//     Work_Hours: t("Work Hours"),
//     select_property: t("select property"),
//     add_new_property: t("add new property"),
//     consumables_From_Stock: t("Consumables From Stock"),
//     Add_Product: t("Add Product"),
//     consumables_out_the_stock: t("consumables out the stock"),
//     Quantity_for: t("Quantity for"),
//     Select_Client: t("Select Client"),
//     Select_Worker: t("Select Worker"),
//     Add_Worker: t("Add Worker"),
//     Add_Client: t("Add Client"),
//     low: t("Low"),
//     medium: t("Medium"),
//     high: t("High"),
//     Selling_Price: t("Selling Price"),
//     desired_product: t("select consumables"),
//     search: t("search"),
//     add: t("Add"),
//     No_consumables_found: t("No consumables found"),
//     hour: t("hour"),
//     day: t("day"),
//     Edit_Task: t("Edit Task"),
//     update_task: t("Update the task"),
//     save: t("save"),
//     select_service: t("select one or more service"),
//     Delete: t("Delete"),
//     Service: t("Service"),
//     Quantity: t("Quantity"),
//   };
//   const supabase = createClient();
//   const dispatch = useDispatch();
//   const departmentId = useSelector<RootState, string>(
//     (state) => state?.departmentSlice?.value?.uid
//   );
//   const textFieldRef = useRef(null);
//   const [workerSalary, setWorkerSalary] = useState<Workers_salary>();
//   const [productsNamesOutStock, setProductsNamesOutStock] = useState([]);
//   const [productsOutStock, setProductsOutStock] = useState<any>([]);
//   const [selected_products_out_stock, setSelected_products_out_stock] =
//     useState<any[]>([]);
//   const [selected_products_in_stock, setSelected_products_in_stock] = useState<
//     any[]
//   >([]);
//   const [productsNames, setProductsNames] = useState([]);
//   const [products, setProducts] = useState<any>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [clients, setClients] = useState<any>([]);
//   const [workers, setWorkers] = useState<any>([]);
//   const [statuss, setStatuss] = useState<any>([]);
//   const [priority, setPriority] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [dialogOpenClient, setDialogOpenClient] = useState(false);
//   const [dialogOpenWorker, setDialogOpenWorker] = useState(false);
//   const [dilogOpenProduct, setDilogOpenProduct] = useState(false);
//   const [property, setProperty] = useState(false);
//   const [newAdd, setNewAdd] = useState(false);
//   const address = useSelector(
//     (state: RootState) => state?.addressReducer?.address
//   );
//   const [isPending2, startTransition2] = useTransition();
//   const [bien, setBien] = useState<any>([]);
//   const [newLatitude, setnewLatitude] = useState(48.8588897);
//   const [newLongitude, setLongitude] = useState(2.3200410217200766);
//   const [clientNames, setClientNames] = useState([]);
//   const [dialogOpenSteper, setDialogOpenSteper] = useState(true);
//   const [statusNames, setStatusNames] = useState<any[]>([]);
//   const [currencyConfig, setCurrencyConfig] = useState({
//     locale: "Europe",
//     currency: "EUR",
//   });
//   const [tasks, setTasks] = useState<any>([]);
//   const [dependencyTitle, setDependencyTitle] = useState<string>();
//   const [newTask, setNewTask] = useState<any>({
//     title: "",
//     description: "",
//     address: address,
//     worker_id: "",
//     status: "",
//     priority: "",
//     client_id: "",
//     cost: "",
//     long: 0.0,
//     lattitude: 0.0,
//     start_date: new Date(),
//     end_date: new Date(),
//     task_type: "hours",
//     start_hour: 0,
//     end_hour: 0,
//     depend_on_id: null,
//     selected_products_out_stock: [],
//     selected_products_in_stock: [],
//     workers: [],
//     services: [],
//   });

//   useEffect(() => {
//     const getCurency = async () => {
//       startTransition2(() => {
//         getCurrency(departmentId).then((data) => {
//           if (data?.error) {
//             toast("An error occurred while fetching company profile data", {
//               position: "bottom-right",
//             });
//           } else {
//             const res = data?.success;
//             setCurrencyConfig({
//               locale: res?.currency,
//               currency: res?.currency,
//             });
//           }
//         });
//       });
//     };
//     departmentId && getCurency();
//   }, [departmentId]);

//   useEffect(() => {
//     setStatusNames(["Pending", "In Progress", "Done", "Delayed"]);
//     const getLocation = () => {
//       if (!navigator.geolocation) {
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setnewLatitude(position.coords.latitude);
//           setLongitude(position.coords.longitude);
//         },
//         () => {}
//       );
//     };
//     getLocation();
//   }, []);

//   useMemo(() => {
//     if (departmentId) {
//       getProductsOutOfStockForTask(departmentId)
//         .then((data) => {
//           if (data) {
//             console.log("dsdfs", data);
//             setProductsOutStock(data ?? []);
//           }
//         })
//         .catch((error) => console.error(error));

//       getProductsInStockForTask(departmentId)
//         .then((data) => {
//           if (data) {
//             setProducts(data ?? []);
//           }
//         })
//         .catch((error) => console.error(error));

//       // getBien(departmentId)
//       //   .then((data) => {
//       //     if (data) {
//       //       setBien(data ?? []);
//       //     }
//       //   })
//       //   .catch((error) => console.error(error));
//     }
//   }, [departmentId]);

//   useEffect(() => {
//     console.log("productsOutStock", productsOutStock);
//     const productInfo = productsOutStock.map((product: any) => ({
//       name: product.name,
//       image: product.image,
//       uid: product.uid,
//       price: product.price,
//     }));
//     setProductsNamesOutStock(productInfo);
//   }, [productsOutStock]);

//   useEffect(() => {
//     const productInfo = products.map((product: any) => ({
//       name: product.name,
//       image: product.image,
//     }));
//     setProductsNames(productInfo);
//   }, [products]);

//   useEffect(() => {
//     const clientChannel = supabase
//       .channel("realtime:client_status")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "Client" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setClients((prevClients: any) => [
//               ...prevClients,
//               {
//                 uid: payload.new.uid,
//                 email: payload.new.email,
//                 first_name: payload.new.first_name,
//                 last_name: payload.new.last_name,
//                 phone: payload.new.phone,
//                 status: payload.new.status,
//                 id: payload.new.id ?? 0,
//               },
//             ]);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       clientChannel.unsubscribe();
//     };
//   });

//   useEffect(() => {
//     const workerChannel = supabase
//       .channel("realtime:user_worker_status")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "UserWorker" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setWorkers((prevWorkers: any) => [
//               ...prevWorkers,
//               {
//                 uid: payload.new.uid,
//                 email: payload.new.email,
//                 first_name: payload.new.first_name,
//                 last_name: payload.new.last_name,
//                 phone: payload.new.phone,
//                 status: payload.new.status,
//                 id: payload.new.id ?? 0,
//               },
//             ]);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       workerChannel.unsubscribe();
//     };
//   });

//   useMemo(() => {
//     if (departmentId) {
//       getData(departmentId)
//         .then((data) => {
//           if (data) {
//             setClients(data[0] ?? []);
//             setWorkers(data[1] ?? []);
//             setStatuss(data[2] ?? []);
//           }
//         })
//         .catch((error) => console.error(error));
//     }
//   }, [departmentId]);

//   useEffect(() => {
//     setClientNames(clients.map((client: any) => client.last_name));
//   }, [clients]);

//   const handleCloseDialogSteper = () => {
//     handleAbort();
//     setDialogOpenSteper(false);
//   };

//   const handleChangePriority = (event: SelectChangeEvent) => {
//     setPriority(event.target.value);
//     setNewTask((prevState: any) => ({
//       ...prevState,
//       ["priority"]: event.target.value,
//     }));
//     dispatch({ payload: 4, type: "VerticalSteperSlice/setActiveStep" });
//   };

//   const handleAddressChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const input = event.target.value;
//     dispatch(setAddress(input));

//     if (input.length > 1) {
//       await axios
//         .get(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             input
//           )}.json?access_token=${
//             process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
//           }&limit=5`
//         )
//         .then((response) => {
//           setSuggestions(response.data.features);
//         })
//         .catch((error) => console.log("Error:", error));
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleKeyPress = async (event: any) => {
//     if (event.key === "Enter") {
//       const input = event.target.value;
//       dispatch(setAddress(input));
//       setNewTask({
//         ...newTask,
//         ["address"]: input,
//       });
//       setSuggestions([]);
//       await axios
//         .get(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             input
//           )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//         )
//         .then((response) => {
//           setnewLatitude(parseFloat(response.data.features[0].center[1]));
//           setLongitude(parseFloat(response.data.features[0].center[0]));
//         })
//         .catch((error) => console.log("Error:", error));
//     }
//   };

//   const handleSuggestionClick = async (suggestion: any) => {
//     dispatch(setAddress(suggestion.place_name));
//     dispatch({ payload: 2, type: "VerticalSteperSlice/setActiveStep" });
//     setNewTask({
//       ...newTask,
//       ["address"]: suggestion.place_name,
//     });
//     setSuggestions([]);
//     await axios
//       .get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           suggestion.place_name
//         )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//       )
//       .then((response) => {
//         setnewLatitude(parseFloat(response?.data?.features[0]?.center[1]));
//         setLongitude(parseFloat(response?.data?.features[0]?.center[0]));
//       })
//       .catch((error) => console.log("Error:", error));
//   };

//   const onSelectWorker = (value: any) => {
//     if (value) {
//       setNewTask({ ...newTask, ["workers"]: [value] });
//       setWorkerSalary(
//         value.map((worker: any) => ({
//           salary_hour: worker.salary_hour,
//           salary_day: worker.salary_day,
//           worker_name: worker.last_name,
//         }))
//       );
//     }
//     console.log("newTask", newTask);
//   };

//   const onSelectClient = (value: any | null) => {
//     if (value) {
//       setNewTask({ ...newTask, ["client_id"]: value.uid });
//     }
//   };

//   const onSelectStatus = (value: string | null) => {
//     if (value) {
//       value === "Pending" && setNewTask({ ...newTask, ["status"]: "pending" });
//       value === "In Progress" &&
//         setNewTask({ ...newTask, ["status"]: "in_progress" });
//       value === "Done" && setNewTask({ ...newTask, ["status"]: "done" });
//       value === "Delayed" && setNewTask({ ...newTask, ["status"]: "delayed" });
//     }
//   };

//   const AddService = (value: any) => {
//     setNewTask((prevState: any) => ({
//       ...prevState,
//       ["services"]: [...prevState.services, value],
//     }));
//   };

//   const DeleteService = (value: any) => {
//     setNewTask((prevState: any) => ({
//       ...prevState,
//       ["services"]: prevState.services.filter((service: any) => {
//         return service.id !== value;
//       }),
//     }));
//   };

//   const handleAbort = () => {
//     setNewTask({
//       title: "",
//       status: "",
//       priority: "",
//       description: "",
//       address: "",
//       client_id: "",
//       cost: "",
//       long: 0.0,
//       lattitude: 0.0,
//       start_date: "",
//       end_date: "",
//       task_type: "",
//       start_hour: 0,
//       end_hour: 0,
//       depend_on_id: "",
//       selected_products_out_stock: [],
//       selected_products_in_stock: [],
//       services: [],
//       workers: [],
//     });
//     setPriority("");
//     setSelected_products_in_stock([]);
//     setSelected_products_out_stock([]);
//     setDialogOpenSteper(false);
//     dispatch({ payload: 0, type: "VerticalSteperSlice/setActiveStep" });
//   };

//   function handleOpenClient() {
//     setDialogOpenClient(false);
//   }

//   function handleOpenWorker() {
//     setDialogOpenWorker(false);
//   }

//   const handleOpenProduct = () => {
//     setDilogOpenProduct(false);
//   };

//   useEffect(() => {
//     const tasks = async () => {
//       if (departmentId) {
//         const { data, error } = await supabase
//           .from("Task")
//           .select("*")
//           .eq("department_id", departmentId)
//           .order("start_date", { ascending: false });
//         if (error) {
//           toast.error(error.message, {
//             position: "bottom-right",
//           });
//           return;
//         }
//         // console.log("erro --- data", error);
//         // console.log("data: ", data);
//         setTasks(data);
//       }
//     };
//     tasks();
//   }, [departmentId, supabase]);

//   const onSubmit = async () => {
//     let Latitude = newLatitude;
//     let Longitud = newLongitude;

//     const response = await axios
//       .get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           address
//         )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//       )
//       .then((response) => {
//         Latitude = parseFloat(response.data.features[0].center[1]);
//         Longitud = parseFloat(response.data.features[0].center[0]);
//         setNewTask({
//           ...newTask,
//           ["address"]: address,
//           ["lattitude"]: Latitude,
//           ["long"]: Longitud,
//         });
//       })
//       .catch((error) => console.log("Error:", error));

//     const returnvalue = taskSchema.safeParse({
//       ...newTask,
//       ["address"]: address,
//       ["lattitude"]: Latitude,
//       ["long"]: Longitud,
//     });
//     if (returnvalue.success) {
//       const allData = {
//         ...newTask,
//         task_id: props.taskId,
//         department_id: departmentId,
//       };
//       try {
//         console.log("allData", allData);
//         const response = await axios.put("/api/task", allData);
//         dispatch(backStep());
//         toast.success("Task Updated successfully");
//         setErrors({});
//         setDialogOpenSteper(false);
//       } catch (error) {
//         console.error("Error submitting task:", error);
//         toast.error("Error updating task");
//         setDialogOpenSteper(false);
//       }
//     } else {
//       const newErrors: any = returnvalue.error.issues.reduce(
//         (acc: any, issue: any) => {
//           acc[issue.path[0]] = issue.message;
//           setErrors(acc);
//           return acc;
//         },
//         {} as Record<string, string>
//       );
//     }
//   };

//   useEffect(() => {
//     if (props.taskId) {
//       getTaskData(props.taskId).then((data) => {
//         if (data) {
//           setNewTask(data);
//           setSelected_products_in_stock(
//             data?.selected_products_in_stock as any[]
//           );
//           setSelected_products_out_stock(
//             data?.selected_products_out_stock as any[]
//           );
//           console.log(
//             "data--------------------------5252525--------------------*",
//             data
//           );
//         }
//       });
//     }
//   }, [props.taskId]);

//   return (
//     <Box>
//       {dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}
//       {dialogOpenWorker && <CreateWorker openSteper={handleOpenWorker} />}

//       <Dialog
//         open={dialogOpenSteper}
//         onClose={handleCloseDialogSteper}
//         fullScreen
//         sx={{
//           overscrollBehavior: "contain",
//           overflow: "auto",
//           overflowY: "auto",
//         }}
//         autoFocus={true}
//         // disableAutoFocus={false}
//       >
//         <DialogContent>
//           <TextField
//             select={true}
//             autoFocus={true}
//             sx={{
//               width: "0%",
//               height: "0%",
//               opacity: "0",
//             }}
//           >
//             <Select />
//           </TextField>
//           <Grid
//             container
//             sx={{
//               width: "100%",
//             }}
//           >
//             <Grid
//               item
//               xs={12}
//               // padding={"0.5rem"}
//               sx={{
//                 display: "flex",
//                 justifyContent: "start",
//                 backgroundColor: "#f5f5f5",
//                 boxShadow: " 0px 2px 4px rgba(0, 0, 0, 0.2)",
//                 alignItems: "start",
//                 height: "8vh",
//               }}
//               position="fixed"
//               top={0}
//               left={0}
//               right={0}
//               zIndex={1000}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   height: "7vh",
//                   width: "100%",
//                   maxwidth: "850px",
//                   // padding: "0.5rem",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     // marginLeft: "1.5rem",
//                   }}
//                 >
//                   <Tooltip title="Abort">
//                     <IconButton
//                       edge="start"
//                       sx={{ marginLeft: "1rem" }}
//                       color="inherit"
//                       aria-label="close"
//                       onClick={() => {
//                         handleAbort();
//                         handleCloseDialogSteper;
//                       }}
//                     >
//                       <Close
//                         sx={{
//                           fontSize: "2rem",
//                           fontWeight: "700",
//                           color: theme.palette.primary.main,
//                           "&:hover": {
//                             color: theme.palette.error.dark,
//                           },
//                         }}
//                       />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: { xs: "1rem", md: "1.5rem" },
//                       fontWeight: "700",
//                       color: theme.palette.primary.main,
//                     }}
//                   >
//                     {tranlateObj.Edit_Task}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "start",
//                     alignItems: "start",
//                     marginRight: "1rem",
//                   }}
//                 >
//                   <CustumButton
//                     style={{
//                       width: "80%",
//                       fontSize: "0.8rem",
//                     }}
//                     label={tranlateObj.update_task}
//                     onClick={onSubmit}
//                   />
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid container spacing={2} marginLeft={{ xs: "0rem", md: "1rem" }}>
//               <Grid item xs={12} marginTop={"7vh"}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "start",
//                     alignItems: "center",
//                     gap: "0.5rem",
//                     textAlign: "center",
//                   }}
//                 >
//                   <ListOutlined
//                     sx={{
//                       color: theme.palette.primary.main,
//                       fontSize: "2.2rem",
//                     }}
//                   />
//                   <Typography
//                     sx={{
//                       fontWeight: 650,
//                       fontSize: "1.1rem",
//                       color: "rgba(0, 0, 0, 1)",
//                     }}
//                   >
//                     {tranlateObj.New_Task}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item md={12} lg={7} xs={12} marginTop={"1rem"}>
//                 <Grid item xs={12}>
//                   <Box sx={{ display: "flex", justifyContent: "start" }}>
//                     <Typography
//                       sx={{
//                         fontWeight: 650,
//                         fontSize: "1rem",
//                         color: "rgba(0, 0, 0, 1)",
//                         display: "flex",
//                         alignItems: "end",
//                       }}
//                     >
//                       1. {tranlateObj.info_general}
//                     </Typography>
//                   </Box>
//                   <Divider
//                     sx={{
//                       marginTop: "0rem",
//                       marginBottom: "0.3rem",
//                       width: "100%",
//                       backgroundColor: "rgba(0, 0, 0, 0.2)",
//                     }}
//                   />
//                   {/* <CreateTaskFirstStep
//                     tranlateObj={tranlateObj}
//                     newTaskData={newTask}
//                     setNewTaskData={setNewTask}
//                     TaskErrors={errors}
//                     tasks={tasks}
//                   /> */}
//                 </Grid>

//                 <Grid item xs={12} marginTop={"1rem"}>
//                   <Grid
//                     container
//                     display={"flex"}
//                     width={"100%"}
//                     spacing={1}
//                     marginTop={"0.5rem"}
//                   >
//                     <Grid
//                       item
//                       xs={6}
//                       md={4}
//                       sx={{
//                         display: "flex",
//                         justifyContent: "start",
//                         alignItems: "start",
//                       }}
//                     >
//                       <CustumButton
//                         style={{
//                           fontSize: "0.7rem",
//                           fontWeight: 600,
//                           width: "300px",
//                         }}
//                         label={tranlateObj.select_property}
//                         onClick={() => {
//                           setNewAdd(false);
//                           setProperty(true);
//                         }}
//                       />
//                     </Grid>
//                     <Grid
//                       item
//                       xs={6}
//                       md={4}
//                       sx={{
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         width: "100%",
//                       }}
//                     >
//                       <CustumButton
//                         style={{
//                           fontSize: "0.7rem",
//                           fontWeight: 600,
//                           width: "300px",
//                         }}
//                         label={tranlateObj.select_from_map}
//                         onClick={() => {
//                           setNewAdd(true);
//                           setProperty(false);
//                         }}
//                       />
//                     </Grid>
//                     <Grid
//                       item
//                       xs={6}
//                       md={4}
//                       sx={{
//                         display: "flex",
//                         justifyContent: "end",
//                         alignItems: "end",
//                       }}
//                     >
//                       <CustumButton
//                         style={{
//                           fontSize: "0.7rem",
//                           fontWeight: 600,
//                           justifySelf: "end",
//                           width: "300px",
//                         }}
//                         label={tranlateObj.add_new_property}
//                         onClick={handleOpenWorker}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Grid>

//                 <Grid item xs={12} marginTop={"1rem"}>
//                   {property && (
//                     <Grid container display={"flex"} width={"100%"} spacing={1}>
//                       <Grid
//                         item
//                         xs={12}
//                         md={2.5}
//                         sx={{
//                           display: "flex",
//                           alignItems: "end",
//                           justifyContent: "start",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.9rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                             width: "100%",
//                           }}
//                         >
//                           {tranlateObj.select_property}
//                         </Typography>
//                       </Grid>
//                       <Grid
//                         item
//                         xs={12}
//                         md={9.5}
//                         marginTop={"0rem"}
//                         width={"100%"}
//                         flexDirection={"column"}
//                         position={"relative"}
//                       >
//                         <Autocomplete
//                           id="combo-box-demo"
//                           options={bien}
//                           getOptionLabel={(option: any) => option.name}
//                           style={{ width: "100%" }}
//                           value={newTask.address}
//                           onChange={(event, value) => {
//                             if (value) {
//                               console.log("value", value);
//                               setNewTask({
//                                 ...newTask,
//                                 ["address"]: value.location,
//                               });
//                               setAddress(value.location);
//                               // setnewLatitude(value.lattitude);
//                               // setLongitude(value.longitude);
//                             }
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               placeholder={tranlateObj.select_property}
//                               variant="standard"
//                             />
//                           )}
//                         />
//                       </Grid>
//                     </Grid>
//                   )}
//                   {newAdd && (
//                     <Grid container display={"flex"} width={"100%"} spacing={1}>
//                       <Grid
//                         item
//                         xs={12}
//                         md={2.5}
//                         sx={{
//                           display: "flex",
//                           alignItems: "end",
//                           justifyContent: "start",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.9rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                             width: "100%",
//                           }}
//                         >
//                           {tranlateObj.address}
//                         </Typography>
//                       </Grid>
//                       <Grid
//                         item
//                         xs={12}
//                         md={9.5}
//                         marginTop={"0rem"}
//                         width={"100%"}
//                         flexDirection={"column"}
//                         position={"relative"}
//                       >
//                         <TextField
//                           ref={textFieldRef}
//                           autoFocus={false}
//                           margin="dense"
//                           hiddenLabel
//                           type="text"
//                           name="address"
//                           placeholder={tranlateObj.address}
//                           value={newTask.address ? newTask.address : address}
//                           onChange={handleAddressChange}
//                           onKeyDown={handleKeyPress}
//                           sx={{
//                             width: "100%",
//                             position: "relative",
//                           }}
//                           variant="standard"
//                         />
//                         {suggestions.length > 0 && (
//                           <List
//                             component="nav"
//                             style={{
//                               maxHeight: "190px",
//                               overflowY: "auto",
//                               backgroundColor: "#F9F9F9",
//                               zIndex: 500,
//                               width: "100%",
//                               top: "100%",
//                               height: "auto",
//                               position: "absolute",
//                               border: "1px solid #E0E0E0",
//                               borderRadius: "0.3rem",
//                             }}
//                           >
//                             {suggestions.map((suggestion: any, index) => (
//                               <ListItem
//                                 sx={{
//                                   cursor: "pointer",
//                                   "&:hover": {
//                                     backgroundColor: "#BDC4CF",
//                                     fontWeight: 700,
//                                     color: "#fff",
//                                   },
//                                 }}
//                                 key={index}
//                                 onClick={() =>
//                                   handleSuggestionClick(suggestion)
//                                 }
//                               >
//                                 <ListItemText primary={suggestion.place_name} />
//                               </ListItem>
//                             ))}
//                           </List>
//                         )}
//                       </Grid>
//                     </Grid>
//                   )}
//                 </Grid>

//                 {errors.address && <FormError error={errors.address} />}

//                 {newAdd && (
//                   <Grid item xs={12} marginTop={"1rem"}>
//                     <Map
//                       latitude={newLatitude}
//                       longitude={newLongitude}
//                       height={"20rem"}
//                     />
//                   </Grid>
//                 )}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "start",
//                     marginTop: "2rem",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontWeight: 650,
//                       fontSize: "1rem",
//                       color: "rgba(0, 0, 0, 1)",
//                       display: "flex",
//                       alignItems: "end",
//                     }}
//                   >
//                     3. {tranlateObj.consumubles_services}
//                   </Typography>
//                 </Box>
//                 <Divider
//                   sx={{
//                     marginTop: "0.6rem",
//                     marginBottom: "0.2rem",
//                     width: "100%",
//                     backgroundColor: "rgba(0, 0, 0, 0.2)",
//                   }}
//                 />

//                 <Grid item xs={12} marginTop={"0rem"}>
//                   <Grid container display={"flex"} width={"100%"} spacing={1}>
//                     <Grid item xs={12} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.5rem",
//                           width: "100%",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.9rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                             width: "100%",
//                           }}
//                         >
//                           {tranlateObj.consumables_From_Stock}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid
//                       item
//                       xs={12}
//                       md={6}
//                       display={"flex"}
//                       alignItems={"center"}
//                       justifyContent={"end"}
//                       width={"100%"}
//                       flexDirection={"column"}
//                     >
//                       <ProductsSelecter
//                         products={productsNames}
//                         onChange={(value: any) => {
//                           setSelected_products_in_stock(value);
//                           console.log(
//                             "selectedProductsIIIIIIIIIIIIIIIIINMM",
//                             selected_products_in_stock
//                           );
//                         }}
//                         tranlateObj={tranlateObj}
//                       />
//                     </Grid>
//                     {/* call the product add component */}
//                     <Grid
//                       item
//                       xs={12}
//                       md={3}
//                       display={"flex"}
//                       justifyContent={{ xs: "start", md: "end" }}
//                       alignItems={{ xs: "start", md: "end" }}
//                       width={"100%"}
//                     >
//                       <CreateProduct
//                         isOverride={true}
//                         style={{
//                           width: "100%",
//                           display: "flex",
//                           // justifyContent: "end",
//                           // alignItems: "end",
//                         }}
//                         openSteper={handleOpenProduct}
//                       >
//                         <Button
//                           sx={{
//                             fontSize: { xs: "0.6rem", md: "0.7rem" },
//                             fontWeight: 550,
//                             width: "100%",
//                             textTransform: "none",
//                             color: "#fff",
//                             backgroundColor: theme.palette.primary.main,
//                           }}
//                         >
//                           {tranlateObj.Add_Product}
//                         </Button>
//                       </CreateProduct>
//                     </Grid>
//                     {selected_products_in_stock && (
//                       <Grid item xs={12}>
//                         <Box sx={{ display: "flex", justifyContent: "start" }}>
//                           <ProductList
//                             products={selected_products_in_stock}
//                             onDelete={(uid: string) => {
//                               console.log("deleted");
//                               const newProducts =
//                                 selected_products_in_stock.filter(
//                                   (product) => product.uid !== uid
//                                 );
//                               setSelected_products_in_stock(newProducts);
//                               console.log(
//                                 "DELEted",
//                                 newProducts,
//                                 selected_products_in_stock
//                               );
//                             }}
//                           />
//                         </Box>
//                       </Grid>
//                     )}
//                   </Grid>
//                 </Grid>

//                 {errors.products && <FormError error={errors.products} />}

//                 <Grid item xs={12} marginTop={"1rem"}>
//                   <Grid container display={"flex"} width={"100%"} spacing={1}>
//                     <Grid item xs={12} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.5rem",
//                           width: "100%",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.9rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.consumables_out_the_stock}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid
//                       item
//                       xs={12}
//                       md={6}
//                       display={"flex"}
//                       alignItems={"center"}
//                       justifyContent={"end"}
//                       width={"100%"}
//                       flexDirection={"column"}
//                     >
//                       <ProductsSelecter
//                         products={productsNamesOutStock}
//                         onChange={(value: any) => {
//                           setSelected_products_out_stock(value);
//                         }}
//                         tranlateObj={tranlateObj}
//                       />
//                     </Grid>
//                     <Grid
//                       item
//                       xs={12}
//                       md={3}
//                       display={"flex"}
//                       justifyContent={{ xs: "start", md: "end" }}
//                       alignItems={{ xs: "start", md: "end" }}
//                       width={"100%"}
//                     >
//                       <CreateProduct
//                         isOverride={true}
//                         style={{
//                           width: "100%",
//                           display: "flex",
//                           justifyContent: "end",
//                           alignItems: "end",
//                         }}
//                         openSteper={handleOpenProduct}
//                       >
//                         <Button
//                           sx={{
//                             fontSize: { xs: "0.6rem", md: "0.7rem" },
//                             fontWeight: 550,
//                             width: "100%",
//                             textTransform: "none",
//                             color: "#fff",
//                             backgroundColor: theme.palette.primary.main,
//                           }}
//                         >
//                           {tranlateObj.Add_Product}
//                         </Button>
//                       </CreateProduct>
//                     </Grid>
//                   </Grid>
//                   {selected_products_out_stock && (
//                     <Grid item xs={12}>
//                       <Box sx={{ display: "flex", justifyContent: "start" }}>
//                         <ProductList
//                           products={selected_products_out_stock}
//                           onDelete={(uid) => {
//                             console.log("deleted", uid);
//                             setSelected_products_out_stock((prevProducts) => {
//                               const newProducts = prevProducts.filter(
//                                 (product) => product.uid !== uid
//                               );
//                               return newProducts;
//                             });
//                           }}
//                         />
//                       </Box>
//                     </Grid>
//                   )}
//                   {errors.products && <FormError error={errors.products} />}
//                 </Grid>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "start",
//                     marginTop: "1.5rem",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontWeight: 650,
//                       fontSize: "1rem",
//                       color: "rgba(0, 0, 0, 1)",
//                       display: "flex",
//                       alignItems: "end",
//                     }}
//                   >
//                     4. {tranlateObj.worker_info}
//                   </Typography>
//                 </Box>
//                 <Divider
//                   sx={{
//                     marginTop: "0.6rem",
//                     marginBottom: "0.5rem",
//                     width: "100%",
//                     backgroundColor: "rgba(0, 0, 0, 0.2)",
//                   }}
//                 />
//                 <Grid item xs={12} width={"100%"}>
//                   <Grid container display={"flex"} width={"100%"} spacing={1}>
//                     <Grid item xs={12} md={2.7}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.5rem",
//                           width: "100%",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "1rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.Select_Worker}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={9} md={6.8}>
//                       <MultiAutocompleteWorkers
//                         label=""
//                         placeholder="Select Worker"
//                         workers={workers}
//                         onSelectedValuesChange={onSelectWorker}
//                         variant="standard"
//                       />
//                     </Grid>
//                     <Grid
//                       item
//                       xs={3}
//                       md={2.5}
//                       display={"flex"}
//                       justifyContent={"center"}
//                       alignItems={"end"}
//                     >
//                       <Box
//                         sx={{
//                           width: "100%",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "end",
//                         }}
//                       >
//                         <Button
//                           onClick={() => {
//                             setDialogOpenWorker(true);
//                           }}
//                           sx={{
//                             fontSize: { xs: "0.6rem", md: "0.7rem" },
//                             fontWeight: 550,
//                             width: "100%",
//                             textTransform: "none",
//                             color: "#fff",
//                             backgroundColor: theme.palette.primary.main,
//                             maxHeight: "2rem",
//                           }}
//                         >
//                           {tranlateObj.Add_Worker}
//                         </Button>
//                       </Box>
//                     </Grid>

//                     {errors.workers && (
//                       <Grid item xs={12}>
//                         {" "}
//                         <FormError error={errors.workers} />
//                       </Grid>
//                     )}
//                   </Grid>
//                   <Grid container display={"flex"} width={"100%"} spacing={1}>
//                     <Grid item xs={12} md={2.7}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.6rem",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "1rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.Select_Client}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={9} md={6.8}>
//                       <TabSelectTask
//                         itemsList={clients}
//                         default={clients.find(
//                           (client: any) => client.uid === newTask.client_id
//                         )}
//                         onSelect={onSelectClient}
//                         placeholder={tranlateObj.client}
//                         variant="standard"
//                         label=""
//                       />
//                     </Grid>
//                     <Grid
//                       item
//                       xs={3}
//                       md={2.5}
//                       display={"flex"}
//                       justifyContent={"center"}
//                       alignItems={"end"}
//                     >
//                       <Box
//                         sx={{
//                           width: "100%",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "end",
//                         }}
//                       >
//                         <Button
//                           onClick={() => {
//                             setDialogOpenClient(true);
//                           }}
//                           sx={{
//                             fontSize: { xs: "0.6rem", md: "0.7rem" },
//                             fontWeight: 550,
//                             width: "100%",
//                             textTransform: "none",
//                             justifySelf: "end",
//                             color: "#fff",
//                             backgroundColor: theme.palette.primary.main,
//                           }}
//                         >
//                           {tranlateObj.Add_Client}
//                         </Button>
//                       </Box>
//                     </Grid>

//                     {errors.client_id && (
//                       <Grid item xs={12}>
//                         <FormError error={errors.client_id} />{" "}
//                       </Grid>
//                     )}

//                     <Grid item md={2.7} xs={12}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.6rem",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "0.9rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.status}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={12} md={9.3}>
//                       <TabSelect
//                         itemsList={statusNames}
//                         onSelect={onSelectStatus}
//                         placeholder={tranlateObj.status}
//                         variant="standard"
//                       />
//                     </Grid>

//                     {errors.status && (
//                       <Grid item xs={12}>
//                         {" "}
//                         <FormError error={errors.status} />
//                       </Grid>
//                     )}

//                     <Grid item xs={12} md={2.7}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.6rem",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "1rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.priority}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={12} md={9.3}>
//                       <FormControl
//                         focused={false}
//                         fullWidth
//                         sx={{
//                           marginTop: 1,
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Select
//                           autoFocus={false}
//                           id="demo-simple-select-helper"
//                           margin="dense"
//                           name="priority"
//                           value={newTask.priority ? newTask.priority : priority}
//                           onChange={handleChangePriority}
//                           variant="standard"
//                           sx={{
//                             width: "100%",
//                           }}
//                         >
//                           <MenuItem disabled value="">
//                             <em>{tranlateObj.priority}</em>
//                           </MenuItem>

//                           <MenuItem value={"low"}>{tranlateObj.low}</MenuItem>
//                           <MenuItem value={"medium"}>
//                             {tranlateObj.medium}
//                           </MenuItem>
//                           <MenuItem value={"high"}>{tranlateObj.high}</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>

//                     {errors.priority && (
//                       <Grid item xs={12}>
//                         {" "}
//                         <FormError error={errors.priority} />
//                       </Grid>
//                     )}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "start",
//                         marginTop: "1.5rem",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontWeight: 650,
//                           fontSize: "1rem",
//                           color: "rgba(0, 0, 0, 1)",
//                           display: "flex",
//                           alignItems: "end",
//                         }}
//                       >
//                         5. {tranlateObj.dependecy}
//                       </Typography>
//                     </Box>
//                     <Divider
//                       sx={{
//                         marginTop: "0.6rem",
//                         marginBottom: "0.5rem",
//                         width: "100%",
//                         backgroundColor: "rgba(0, 0, 0, 0.2)",
//                       }}
//                     />
//                     <Grid item xs={12} md={2.7}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           marginTop: "1.6rem",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "1rem",
//                             color: "#222222",
//                             display: "flex",
//                             alignItems: "end",
//                           }}
//                         >
//                           {tranlateObj.dependecy}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid
//                       item
//                       xs={12}
//                       md={9.3}
//                       sx={{
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       <Autocomplete
//                         autoFocus={false}
//                         options={tasks}
//                         getOptionLabel={(option: any) => option.title}
//                         onChange={(event, selectedChoice) => {
//                           console.log("sa", event);
//                           console.log("858", selectedChoice);
//                           setNewTask((prevState: any) => ({
//                             ...prevState,
//                             ["depend_on_id"]: selectedChoice?.uid
//                               ? selectedChoice?.uid
//                               : null,
//                           }));
//                         }}
//                         id="depen-on"
//                         autoSelect
//                         renderInput={(params: any) => (
//                           <TextField
//                             {...params}
//                             placeholder={tranlateObj.dependecy}
//                             variant="standard"
//                           />
//                         )}
//                         sx={{
//                           width: "100%",
//                         }}
//                       />
//                     </Grid>
//                     {errors.depend_on && <FormError error={errors.depend_on} />}

//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "start",
//                         marginTop: "2rem",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontWeight: 650,
//                           fontSize: "1rem",
//                           color: "rgba(0, 0, 0, 1)",
//                           display: "flex",
//                           alignItems: "end",
//                         }}
//                       >
//                         6. {tranlateObj.price_summary}
//                       </Typography>
//                     </Box>
//                     <Divider
//                       sx={{
//                         marginTop: "1rem",
//                         marginBottom: "1rem",
//                         width: "100%",
//                         backgroundColor: "rgba(0, 0, 0, 0.2)",
//                       }}
//                     />

//                     {/* <SellingPrice
//                       translateObj={tranlateObj}
//                       departement_id={departmentId}
//                       onAddOption={AddService}
//                       onDeleteOption={DeleteService}
//                     /> */}

//                     <Grid item xs={12}>
//                       {errors.price && <FormError error={errors.price} />}
//                     </Grid>

//                     <Box
//                       sx={{
//                         marginTop: "1.2rem",
//                         width: "100%",
//                       }}
//                     >
//                       <EstimatedPrice
//                         additional_cost={parseFloat(newTask.cost)}
//                         currency={currencyConfig.currency}
//                         worker_salary={workerSalary}
//                         products_out_stock={selected_products_out_stock}
//                         products_in_stock={selected_products_in_stock}
//                         task={newTask}
//                         onEstimateChange={(value: any) => {
//                           setNewTask({ ...newTask, ["cost"]: value });
//                         }}
//                       />
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Grid>
//               <Grid
//                 item
//                 md={5}
//                 lg={5}
//                 xs={12}
//                 height={"30rem"}
//                 justifyContent={"center"}
//                 display={{
//                   xs: "none",
//                   lg: "flex",
//                 }}
//                 sx={{
//                   width: { md: "95", lg: "100%" },
//                   maxWidth: "350px",
//                   position: "fixed",
//                   top: "8vh",
//                   right: { lg: 0, md: "2%" },
//                   zIndex: 1000,
//                 }}
//               >
//                 <VerticalLinearStepper />
//               </Grid>
//             </Grid>
//           </Grid>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }
