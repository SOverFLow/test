"use client";
import {
	AppBar,
	Box,
	Button,
	Dialog,
	DialogContent,
	Divider,
	Grid,
	IconButton,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import EditIcon from "@mui/icons-material/Edit";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import theme from "@/styles/theme";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DateRangePicker from "../components/datePicker";
import { FormError } from "@/components/ui/FormError/FormError";
import { getContract, getService } from "./utils";

import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useZodContract, useZodService } from "@/schemas/zod/zod.contract";
import ServiceTable from "../../service/ServiceTable";
import SelectOption from "../components/SelectOption";
import CreateBien from "../../biens/CreateBien";
import AddButton from "../../service/components/AddButton";
import { getBienByClient } from "../utils/getBien";
import { getClients } from "../../service/utils/getTables";
import { useParams } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateClient from "../../clients/CreateClient";

interface EditContractProps {
	contractId: string;
}

export default function EditContract({ contractId }: EditContractProps) {
	const supabase = createClient();

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [clients, setClients] = useState<any>([]);
	const [bienNames, setBienNames] = useState<any>([]);

	const t = useTranslations("Contract");
	const { slug } = useParams();
	const [dialogOpenClient, setDialogOpenClient] = useState(false);

	const handleDialogState = () => {
		setDialogOpen(!dialogOpen);
	};

	const [newContract, setNewContract] = useState<any>({
		start_date: "",
		end_date: "",
		name: "",
		description: "",
	});

	const [ServiceData, setServiceData] = useState<any>([]);

	const handleContractInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewContract((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};
	useEffect(() => {
		getContract(contractId)
			.then((data) => {
				if (data) {
					console.log("data: ", data);
					setNewContract({
						name: data.name,
						description: data.description,
						start_date: data.start_date,
						end_date: data.end_date,
					});
				}
			})
			.catch((error) => console.error(error));
		// getServices(contractId)
		// 	.then((data) => {
		// 		console.log("data: sss", data);
		// 		setServiceData(data);
		// 	})
		// 	.catch((error) => console.error(error));
	}, [contractId]);

	const ZodContract = useZodContract();
	const onSubmit = async () => {
		const zodValidation = ZodContract.safeParse(newContract);
		if (zodValidation.success) {
			try {
				const { data, error } = await supabase
					.from("Contract")
					.update({
						...newContract,
					})
					.eq("uid", contractId)
					.single();
				if (error) {
					throw error;
				}
				toast.success(t("Contract Edited successfully"));
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
					console.log("errors", acc);
					return acc;
				},
				{} as Record<string, string>
			);
		}
	};


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
	}, [newContract.client_id]);

	useEffect(() => {
		if (!slug) return;
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

	}, [slug]);
	const onSelectClient = (value: any | null) => {
		console.log("value client test", value);
		if (value) {
			setNewContract((prevState: any) => ({
				...prevState,
				client_id: value.uid,
			}));
		}
	};

	const onSelectBien = (value: any | null): void => {
		setNewContract({
			...newContract,
			bien_id: value.uid,
		});
	};

	function handleOpenClient() {
		setDialogOpenClient(false);
	}

	return (
		<Box>
			<Box>
				<Button
					variant="text"
					color="info"
					onClick={handleDialogState}
					sx={{
						width: "30px",
						"&:hover": {
							backgroundColor: "transparent",
						},
					}}
					size="small"
					title="edit client"
				>
					<EditIcon />
				</Button>
			</Box>
			{dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}

			<Dialog open={dialogOpen} onClose={handleDialogState} fullScreen autoFocus={true}>
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
							{t("Edit Contract")}
						</Typography>

						{/* <Box sx={{ display: "flex", gap: "1rem", marginRight: "15rem" }}></Box> */}
					</Toolbar>
				</AppBar>
				<DialogContent autoFocus={true}>
					<Grid
						container
						sx={{
							width: "70rem",
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
								<AttachFileSharpIcon sx={{ fontSize: "2rem", color: theme.palette.primary.main }} />
								<Typography
									sx={{
										fontSize: "1.5rem",
										fontWeight: "550",
										color: theme.palette.text.primary,
									}}
								>
									{t("Edit Contract")}
								</Typography>
							</Box>
						</Grid>
						<Grid item md={11} xs={12}>
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
										// setDateRange(date);
										setNewContract((prevState: any) => ({
											...prevState,
											start_date: date[0].format("	"),
											end_date: date[1].format("YYYYMMDD"),
										}));
									}
								}}
								value={[newContract.start_date, newContract.end_date]}
							/>
							{(errors.start_date && <FormError error={errors.start_date} />) ||
								(errors.end_date && <FormError error={errors.end_date} />)}
							<TextField
								margin="dense"
								error={errors.nmae ? true : false}
								label={t("name")}
								type="text"
								fullWidth
								name={t("name")}
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
								onChange={handleContractInputChange}
								required={false}
							/>
							{errors.description && <FormError error={errors.description} />}
							<Grid container>

								<Grid item xs={9} >
									<SelectOption
										options={clients}
										onSelect={onSelectClient}
										lable={t("select-client")}
										defaultVal="Choose Clients"
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

							</Grid>
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
													const t = clients.find((client: any) => client.uid === newContract.client_id);
													return t?.first_name + " " + t?.last_name;
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
						</Grid>
						<Grid
							item
							xs={11}
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
