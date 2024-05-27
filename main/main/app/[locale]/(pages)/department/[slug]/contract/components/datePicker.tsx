import { Box } from "@mui/material";
import { DatePicker } from "antd";
import { useState } from "react";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
export default function DateRangePicker(props: { onSelect: (date: any) => void; value: any }) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("Contract");
	return (
		<Box
			sx={{ display: "flex", width: { xs: "100%", md: "100%" }, alignItems: "end" }}
			autoFocus={false}
		>
			<DatePicker.RangePicker
				autoFocus={false}
				value={props.value ? [dayjs(props.value[0]), dayjs(props.value[1])] : [null, null]}
				style={{
					height: "2.8rem",
					width: "100%",
					justifyContent: "end",
					color: "#000000",
					backgroundColor: "#fff",
				}}
				popupStyle={{ zIndex: 9999 }}
				open={open}
				onOpenChange={setOpen}
				placeholder={[t("Start Date"), t("End Date")] as [string, string]}
				format="YYYY-MM-DD"
				onChange={props.onSelect}
			/>
		</Box>
	);
}
