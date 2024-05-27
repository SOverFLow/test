"use client";

import DeleteIcon from "@mui/icons-material/Delete";

import { DialogDelete } from "@/components/ui/Dialog/DialogDelete";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DeleteClient {
	contractId: number | string;
}

export default function DeleteContract(props: DeleteClient) {
	const supabase = createClient();
	const [dialogState, setDialogState] = useState(false);

	const t = useTranslations("Contract");

	const handleDialogState = () => {
		setDialogState(!dialogState);
	};

	const handleDelete = async () => {
		try {
			const { error } = await supabase.from("Contract").delete().eq("uid", props.contractId);
			if (error) {
				throw error;
			}
			toast.success(t("Contract deleted successfully"));
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
			DialogContentText={t("Are you sure you want to delete this Contract?")}
		/>
	);
}
