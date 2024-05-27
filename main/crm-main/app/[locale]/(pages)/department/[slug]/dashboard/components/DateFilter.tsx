import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Space, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Box, Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const { RangePicker } = DatePicker;

const DateFilter: React.FC = () => {
	const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
	const router = useRouter();
	const searchParams = useSearchParams();

	const t = useTranslations("dashboard");
	const parseInitialDates = useCallback(
		(dateValue: string | null): [Dayjs | null, Dayjs | null] => {
			if (dateValue && dateValue.includes("-")) {
				const [start, end] = dateValue.split("-");
				return [dayjs(start, "YYYYMMDD"), dayjs(end, "YYYYMMDD")];
			}
			return [null, null];
		},
		[]
	);

	const updateURLParameter = useCallback(
		(range: [Dayjs | null, Dayjs | null]) => {
			const params = new URLSearchParams(searchParams);
			if (range) {
				const startDate = range[0] ? range[0].format("YYYYMMDD") : "";
				const endDate = range[1] ? range[1].format("YYYYMMDD") : "";
				const dateValue = startDate && endDate ? `${startDate}-${endDate}` : "";

				if (dateValue) {
					params.set("date", dateValue);
				}
			} else {
				params.delete("date");
			}
			const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
			router.replace(newRelativePathQuery);
		},
		[router, searchParams]
	);

	useEffect(() => {
		let initialDates: [dayjs.Dayjs | null, dayjs.Dayjs | null];
		const dateParam = searchParams.get("date");

		if (!dateParam) {
			const today = dayjs();
			initialDates = [today.startOf("month"), today];
		} else {
			initialDates = parseInitialDates(dateParam);
		}
		setDateRange(initialDates);
		updateURLParameter(initialDates);
	}, [router, searchParams, parseInitialDates, updateURLParameter]);

	const handleRangeChange = (dates: any) => {
		setDateRange(dates);
		updateURLParameter(dates);
	};

	const setQuickRange = (start: Dayjs, end: Dayjs) => {
		const newRange: [Dayjs, Dayjs] = [start, end];
		setDateRange(newRange);
		updateURLParameter(newRange);
	};

	const setToday = () => {
		const today = dayjs();
		setQuickRange(today, today);
	};

	const setThisWeek = () => {
		const startOfWeek = dayjs().startOf("week");
		const endOfWeek = dayjs();
		setQuickRange(startOfWeek, endOfWeek);
	};

	const setThisMonth = () => {
		const startOfMonth = dayjs().startOf("month");
		const endOfMonth = dayjs();
		setQuickRange(startOfMonth, endOfMonth);
	};

	return (
		<Stack
			direction={{ xs: "column", md: "row" }}
			spacing={2}
			justifyContent="flex-end"
		>
			<RangePicker value={dateRange} onChange={handleRangeChange} format="YYYY-MM-DD" />
			<Stack direction="row" spacing={1} justifyContent="space-between">
				<Button onClick={setToday}>{t("Today")}</Button>
				<Button onClick={setThisWeek}>{t("This Week")}</Button>
				<Button onClick={setThisMonth}>{t("This Month")}</Button>
			</Stack>
		</Stack>
	);
};

export default DateFilter;
