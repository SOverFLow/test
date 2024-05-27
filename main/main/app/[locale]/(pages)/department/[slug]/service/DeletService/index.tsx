"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { toast } from "react-toastify";

interface DeleteService {
	serviceId: number | string;
}

export default function DeleteService(props: DeleteService) {
	const supabase = createClient();
	const [dialogState, setDialogState] = useState(false);

	const t = useTranslations("Service");

	const handleDialogState = () => {
		setDialogState(!dialogState);
	};

	const handleDelete = async () => {
		try {
			const { error } = await supabase.from("Service").delete().eq("uid", props.serviceId);
			if (error) {
				throw error;
			}
			toast.success(t("Service deleted successfully"));
			handleDialogState();
		} catch (error) {
			toast.error(t("An unexpected error occurred"));
			handleDialogState();
		}
	};

	return (
		<DialogDelete
			label={<DeleteIcon />}
			openDialog={dialogState}
			handleCloseDialog={handleDialogState}
			handleDelete={handleDelete}
			handleOpenDialog={handleDialogState}
			DialogTitle={t("Confirm Delete")}
			DialogContentText={t("Are you sure you want to delete this service?")}
		/>
	);
}
