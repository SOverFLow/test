"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";

import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { tvaSchema } from "@/utils/schemas/tva/tvaSchema";
import { styled } from "@mui/material";
import { useTranslations } from "next-intl";

const StyledInput = styled(TextField)(() => ({
	"& .MuiInputBase-root": {
		padding: "0px",
	},
}));

interface props {
	children?: React.ReactNode;
	isOverride?: boolean;
}

export default function CreateTva({ children, isOverride }: props) {
	const supabase = createClient();
	const departmentId = useSelector<RootState, string>(
		(state) => state?.departmentSlice?.value?.uid
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const t = useTranslations("tva");

	const [newTva, setNewTva] = useState({
		country: "",
		description: "",
		name: "",
		value: 0.0,
	});

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (name == "value") {
			setNewTva((prevState) => ({
				...prevState,
				[name]: parseFloat(value),
			}));
			return;
		}
		setNewTva((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const onSubmit = async () => {
		const returnvalue = tvaSchema.safeParse(newTva);

		if (returnvalue.success) {
			const allData = { ...newTva, department_id: departmentId };
			try {
				const { data, error } = await supabase.from("TVA").insert([allData]).select();

				if (error) {
					throw error;
				}

				toast.success(t("success"), {
					position: "bottom-right",
				});
				setErrors({});
			} catch (error) {
				toast.success(t("error"), {
					position: "bottom-right",
				});
			}

			setNewTva({
				country: "",
				description: "",
				name: "",
				value: 0.0,
			});
			setDialogOpen(false);
		} else {
			returnvalue.error.issues.reduce(
				(acc: any, issue: any) => {
					acc[issue.path[0]] = issue.message;
					setErrors(acc);
					return acc;
				},
				{} as Record<string, string>
			);
		}
	};

	return (
		<Box>
			{isOverride ? (
				<Box onClick={handleOpenDialog}>{children}</Box>
			) : (
				<Box>
					<CustumButton
						label={
							<>
								<AddIcon />
								{t("create")}
							</>
						}
						onClick={handleOpenDialog}
					/>
				</Box>
			)}

			<Dialog open={dialogOpen} onClose={handleCloseDialog}>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label={t("name")}
						type="text"
						fullWidth
						name="name"
						value={newTva.name}
						onChange={handleInputChange}
					/>
					{errors.name && <FormError error={errors.name} />}
					<TextField
						autoFocus
						margin="dense"
						label={t("country")}
						type="text"
						fullWidth
						name="country"
						value={newTva.country}
						onChange={handleInputChange}
					/>
					{errors.country && <FormError error={errors.country} />}
					<TextField
						autoFocus
						margin="dense"
						label={t("value")}
						type="number"
						fullWidth
						name="value"
						value={newTva.value}
						onChange={handleInputChange}
					/>
					{errors.value && <FormError error={errors.value} />}
					<StyledInput
						margin="dense"
						label={t("description")}
						type="text"
						fullWidth
						name="description"
						InputLabelProps={{ required: false }}
						value={newTva.description}
						onChange={handleInputChange}
						rows={3}
						multiline
					/>
					{errors.description && <FormError error={errors.description} />}
				</DialogContent>
				<DialogActions>
					<CustumButton label={t("Cancel")} onClick={handleCloseDialog} />
					<CustumButton label={t("Save")} onClick={onSubmit} />
				</DialogActions>
			</Dialog>
		</Box>
	);
}
