"use client";

import {
	AppBar,
	Box,
	Checkbox,
	Chip,
	Dialog,
	DialogContent,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import theme from "@/styles/theme";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DateRangePicker from "../components/datePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useParams } from "next/navigation";
import { FormError } from "@/components/ui/FormError/FormError";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useZodContract } from "@/schemas/zod/zod.contract";
import { getClients } from "../../service/utils/getTables";
import { getServiceByDepartment } from "../utils/getService";
import { getBienByClient } from "../utils/getBien";
import AddButton from "../../service/components/AddButton";
import CreateClient from "../../clients/CreateClient";
import CreateService from "../../service/CreateService";
import CreateBien from "../../biens/CreateBien";
import SelectOption from "../components/SelectOption";
import MultiSelectOption from "../components/MultiSelect";
import { generateProductReference } from "./utils";

interface Contract {
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	client_id: string;
	department_id: string;
	bien_id: string;
}

interface props {
	children?: React.ReactNode;
	isOverride?: boolean;
	openDialog?: boolean;
	handleDialogOpen?: () => void;
	onClose?: () => void;
	client_id?: string;
	clientName?: string;
}

export default function CreateContract({
	children,
	isOverride,
	openDialog = false,
	onClose,
	client_id = "",
	clientName = "",
}: props) {
	const supabase = createClient();

	const { slug } = useParams();
	const t = useTranslations("Contract");

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [dateRange, setDateRange] = useState<any>();
	const [serviceIds, setServiceIds] = useState<string[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [dialogOpenClient, setDialogOpenClient] = useState(false);
	const [clients, setClients] = useState<any>([]);
	const [service, setService] = useState<any>([]);
	const [bienNames, setBienNames] = useState<any>([]);

	const [newContract, setNewContract] = useState<Contract>({
		name: "",
		description: "",
		start_date: "",
		end_date: "",
		client_id: "",
		bien_id: "",
		department_id: slug as string,
	});

	const onSelectClient = (value: any | null) => {
		console.log("value client test", value);
		if (value) {
			setNewContract((prevState: any) => ({
				...prevState,
				client_id: value.uid,
			}));
		}
	};

	const [selectedOption, setSelectedOption] = useState<any>([]);

	const onSelectBien = (value: any | null): void => {
		setNewContract({
			...newContract,
			bien_id: value.uid,
		});
	};

	const [selectedServices, setSelectedServices] = useState<any>([]);
	const onSelectService = (value: any | null): void => {
		setSelectedServices(
			value.map((service: any) => ({ ...service, discount: 0 }))
		);
		console.log("value", value);
		setServiceIds(
			value.map((service: any) => {
				return service.uid;
			})
		);
	};

	const handleDiscountChange = (uid: string, discount: number) => {
		setSelectedServices((prevServices: any) =>
			prevServices.map((service: any) => {
				if (service.uid === uid) {
					return { ...service, discount };
				}
				return service;
			})
		);
	};

	useEffect(() => {
		const clientChannel = supabase
			.channel("postgres_changes")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "Client" },
				(payload) => {
					if (payload.eventType === "INSERT") {
						setClients((prevClients: any) => [
							...prevClients,
							{
								uid: payload.new.uid,
								label: `${payload.new.first_name} ${payload.new.last_name}`,
								//  payload.new.first_name,
								// last_name: payload.new.last_name,
							},
						]);
					}
				}
			)
			.subscribe();

		// const ServiceChannel = supabase
		// .channel("postgres_changes_service")
		// .on("postgres_changes", { event: "*", schema: "public", table: "Service" }, (payload) => {
		// 	if (payload.eventType === "INSERT") {
		// 		setService((prevClients: any) => [
		// 			...prevClients,
		// 			{
		// 				uid: payload.new.uid,
		// 				label: payload.new.title,
		// 			},
		// 		]);
		// 	}
		// });
		return () => {
			clientChannel.unsubscribe();
			// ServiceChannel.unsubscribe();
		};
	});

	useEffect(() => {
		const bienChannel = supabase
			.channel("bienbien")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "Bien" },
				(payload) => {
					console.log("Bien data", payload);
					if (payload.eventType === "INSERT") {
						console.log("Bien data", payload);
						setBienNames((prevClients: any) => [
							...prevClients,
							{
								uid: payload.new.uid,
								label: payload.new.name,
							},
						]);
					}
				}
			);
		return () => {
			bienChannel.unsubscribe();
		};
	});

	useEffect(() => {
		if (!slug) return;
		getBienByClient(newContract.client_id)
			.then((data) => {
				if (data) {
					setBienNames(
						data.map((bien: any) => ({
							uid: bien.uid,
							label: bien.name,
						}))
					);
				}
			})
			.catch((error) => console.error(error));
	}, [newContract.client_id, slug]);

	useEffect(() => {
		if (!slug) return;
		if (client_id) {
			setNewContract((prevState: any) => ({
				...prevState,
				client_id: client_id,
			}));
			setClients([
				{
					uid: client_id,
					label: clientName,
				},
			]);
		} else {
			getClients(slug as string)
				.then((data) => {
					if (data) {
						const uniqueClients = Array.from(
							new Set(
								data.map((client) => ({
									uid: client.uid,
									label: `${client.first_name} ${client.last_name}`,
								}))
							)
						);
						setClients([...uniqueClients]);
					}
				})
				.catch((error) => console.error(error));
		}
	}, [slug, client_id]);

	useEffect(() => {
		getServiceByDepartment(slug as string)
			.then((data) => {
				if (data) {
					const service = Array.from(
						new Set(
							data.map((service: any) => ({
								uid: service.uid,
								label: service.title,
							}))
						)
					);
					console.log("Service data", [...service]);
					setService([...service]);
				}
			})
			.catch((error) => console.error(error));
	}, [slug]);

	const ZodContract = useZodContract();
	const onSubmit = async () => {
		const zodValidation = ZodContract.safeParse(newContract);
		if (
			serviceIds.length <= 0 ||
			newContract.client_id === "" ||
			newContract.bien_id === ""
		) {
			console.log("aloooooooooooooooooo");
			toast.error("Please fill all required fields"),
			{
				position: "bottom-right",
			};
		} else {
			if (zodValidation.success) {
				try {
					const ref = generateProductReference();
					const { data, error } = await supabase
						.from("Contract")
						.insert({
							...newContract,
							reference: ref,
						})
						.select(`uid`)
						.single();
					if (error) {
						console.error("COntract Insert Error:", error);
					}
					if (data) {
						const { data: manyToManyData, error: manyToManyError } =
							await supabase.from("contract_service").insert(
								selectedServices.map((service: any) => ({
									contract_id: data.uid,
									service_id: service.uid,
									discount: service.discount,
								}))
							);
						if (manyToManyError) {
							console.error("Error", manyToManyError);
						}
					}
					toast.success(t("Contract created successfully")),
					{
						position: "bottom-right",
					};
					setNewContract({
						name: "",
						description: "",
						start_date: "",
						end_date: "",
						client_id: "",
						department_id: slug as string,
						bien_id: "",
					});
					setServiceIds([]);
					setService([]);
					setSelectedOption([]);
					setDateRange([]);
					setErrors({});
					setSelectedServices([]);
					handleDialogState();
				} catch (error) {
					console.error(error);
					toast.error(t("An unexpected error occurred"));
				}
			} else {
				zodValidation.error.issues.reduce(
					(acc: any, issue: any) => {
						acc[issue.path[0]] = issue.message;
						setErrors(acc);
						return acc;
					},
					{} as Record<string, string>
				);
			}
		}
	};

	const handleContractInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		setNewContract((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleDialogState = () => {
		setDialogOpen(!dialogOpen);
		onClose && onClose();
	};

	const getServiceUids = (selectedOption: any) => {
		const selectedServices = service.filter((s: any) =>
			selectedOption.includes(s.title)
		);
		const uids = selectedServices.map((s: any) => s.uid);
		return uids;
	};
	const handleServiceChange = (
		event: SelectChangeEvent<typeof selectedOption>
	) => {
		const {
			target: { value },
		} = event;
		const newSelectedOptions =
			typeof value === "string" ? value.split(",") : value;
		setSelectedOption(newSelectedOptions);
		setServiceIds(newSelectedOptions);
	};

	function handleOpenClient() {
		setDialogOpenClient(false);
	}

	return (
		<Box>
			{isOverride ? (
				<Box onClick={handleDialogState}>{children}</Box>
			) : (
				<Box>
					<CustumButton
						label={
							<>
								<AddIcon />
								{t("Create New Contract")}
							</>
						}
						onClick={handleDialogState}
					/>
				</Box>
			)}
			{dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}

			<Dialog
				open={openDialog ? openDialog : dialogOpen}
				onClose={handleDialogState}
				fullScreen
				autoFocus={true}
			>
				<AppBar
					sx={{
						position: "relative",
						backgroundColor: "#f5f5f5",
					}}
				>
					<Toolbar
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "space-between",
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleDialogState}
							aria-label="close"
							sx={{ marginLeft: "1rem" }}
						>
							<Close
								sx={{
									fontSize: "2rem",
									fontWeight: "700",
									color: theme.palette.primary.main,
								}}
							/>
						</IconButton>

						<Typography
							sx={{
								marginLeft: "1rem",
								fontSize: "1.5rem",
								fontWeight: "700",
								color: theme.palette.primary.main,
								textAlign: "center",
								flex: 1,
							}}
						>
							{t("Create Contract")}
						</Typography>
					</Toolbar>
				</AppBar>
				<DialogContent autoFocus={true}>
					<Grid
						container
						sx={{
							width: "60rem",
							overflow: "auto",
							overflowX: "hidden",
							overflowY: "auto",
							maxWidth: "100%",
							mt: 6,
							marginLeft: { xs: "0rem", lg: "2rem" },
						}}
					>
						<Grid item md={6} xs={12}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "start",
									marginBottom: "1rem",
									gap: "1rem",
								}}
							>
								<AttachFileSharpIcon
									sx={{ fontSize: "2rem", color: theme.palette.primary.main }}
								/>
								<Typography
									sx={{
										fontSize: "1.5rem",
										fontWeight: "550",
										color: theme.palette.text.primary,
									}}
								>
									{t("Create Contract")}
								</Typography>
							</Box>
						</Grid>

						<Grid item md={12} xs={12}>
							<Typography
								sx={{
									mt: 2,
									fontWeight: 550,
									fontSize: "1.2rem",
									color: "#222222",
									display: "flex",
									alignItems: "end",
								}}
							>
								{t("General Information :")}
							</Typography>
							<Divider
								sx={{
									marginTop: "1rem",
									marginBottom: "1rem",
									width: "100%",
									backgroundColor: "rgba(0, 0, 0, 0.2)",
								}}
							/>
							<DateRangePicker
								onSelect={(date: any) => {
									if (date) {
										setDateRange(date);
										setNewContract((prevState: any) => ({
											...prevState,
											start_date: date[0].format("YYYYMMDD"),
											end_date: date[1].format("YYYYMMDD"),
										}));
									}
								}}
								value={dateRange}
							/>
							{(errors.start_date && <FormError error={errors.start_date} />) ||
								(errors.end_date && <FormError error={errors.end_date} />)}
							<TextField
								margin="dense"
								label={t("name")}
								type="text"
								fullWidth
								name="name"
								value={newContract.name}
								onChange={handleContractInputChange}
							/>
							{errors.name && <FormError error={errors.name} />}
							<TextField
								margin="dense"
								label={t("Description")}
								type="text"
								fullWidth
								name="description"
								value={newContract.description}
								required={false}
								onChange={handleContractInputChange}
							/>
							{/* {errors.description && <FormError error={errors.description} />} */}
						</Grid>
						<Grid item xs={9}>
							<SelectOption
								disable={client_id ? true : false}
								options={clients}
								onSelect={onSelectClient}
								lable={t("select-client")}
								defaultVal={client_id ? client_id : "Choose Clients"}
							/>
						</Grid>
						<AddButton
							style={{
								paddingLeft: 2,
								paddingTop: 2,
							}}
							label={t("add-client")}
							onClick={() => setDialogOpenClient(true)}
						/>
						<Grid item xs={12}>
							<Box
								display="flex"
								flexDirection={{ xs: "column", md: "row" }}
								alignItems="center"
								gap="1rem"
							>
								<SelectOption
									options={bienNames}
									onSelect={onSelectBien}
									lable={t("select-bien")}
									defaultVal="Choose Bien"
								/>

								<Box width="32%">
									<CreateBien
										isOverride={true}
										canCreateClient={false}
										style={
											{
												// display: "flex",
												// justifyContent: "end",
												// width: "100%",
												// margin: "0px !important",
												// padding: "0px !important",
											}
										}
										myClient={{
											uid: newContract.client_id,
											name: (() => {
												const t = clients.find(
													(client: any) => client.uid === newContract?.client_id
												);
												return t?.label;
											})(),
										}}
									>
										<CustumButton
											onClick={() => { }}
											style={{
												fontSize: "0.7rem",
												fontWeight: 550,
												width: "100%",
												textTransform: "none",
												color: "#fff",
												backgroundColor: theme.palette.primary.main,
												maxHeight: "2.3rem",
											}}
											label={
												<>
													<AddCircleOutlineIcon />
													{t("add-bien")}
												</>
											}
										/>
									</CreateBien>
								</Box>
							</Box>
							{errors.bien_id && <FormError error={errors.bien_id} />}
						</Grid>
						<Grid item xs={12} sx={{ mt: 2 }}>
							<Box
								display="flex"
								flexDirection={{ xs: "column", md: "row" }}
								alignItems="center"
								gap="1rem"
							>
								<MultiSelectOption
									lable={t("slecte-service")}
									options={service}
									onSelect={onSelectService}
								/>
								<Box width="32%">
									<CreateService isOverride={true}>
										<CustumButton
											onClick={() => { }}
											style={{
												fontSize: "0.7rem",
												fontWeight: 550,
												width: "100%",
												textTransform: "none",
												color: "#fff",
												backgroundColor: theme.palette.primary.main,
												maxHeight: "2.3rem",
											}}
											label={
												<>
													<AddCircleOutlineIcon />
													{t("add-service")}
												</>
											}
										/>
									</CreateService>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12}>
							{selectedServices.map((option: any) => (
								<Box
									width="75%"
									display="flex"
									alignItems="center"
									key={option.uid}
								>
									<Box flexGrow={1} display="flex" alignItems="center">
										{option.label}
									</Box>
									<TextField
										type="number"
										placeholder={t("discount")}
										variant="outlined"
										size="small"
										value={option.discount}
										onChange={(e) =>
											handleDiscountChange(
												option.uid,
												parseInt(e.target.value) || 0
											)
										}
										sx={{ marginLeft: 2, width: 200 }}
									/>
								</Box>
							))}
						</Grid>
						<Grid
							item
							xs={12}
							marginTop={"1rem"}
							justifyContent={"end"}
							alignItems={"end"}
							display={"flex"}
						>
							<CustumButton
								label={t("save")}
								onClick={onSubmit}
								style={{
									width: "150px",
									fontSize: "1rem",
									fontWeight: "700",
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
