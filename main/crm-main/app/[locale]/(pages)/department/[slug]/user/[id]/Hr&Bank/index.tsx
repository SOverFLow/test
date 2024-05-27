"use client";

import {
	Box,
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { useEffect, useState } from "react";
import UserProfile from "../../../components/profile";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslations } from "next-intl";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

interface Data {
	lable: string;
	Ban: string;
	Bank: string;
	BankAccountNumber: string;
	IBAN: string;
	BicSwiftCode: string;
	Currency: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: "Ban",
		numeric: false,
		disablePadding: true,
		label: "Ban Label",
	},
	{
		id: "Bank",
		numeric: true,
		disablePadding: false,
		label: "Bank",
	},
	{
		id: "BankAccountNumber",
		numeric: true,
		disablePadding: false,
		label: "Bank account number",
	},
	{
		id: "IBAN",
		numeric: true,
		disablePadding: false,
		label: "IBAN",
	},
	{
		id: "BicSwiftCode",
		numeric: true,
		disablePadding: false,
		label: "BIC/SWIFT code",
	},
	{
		id: "Currency",
		numeric: true,
		disablePadding: false,
		label: "Currency",
	},
];

const HrAndBank = ({ userId, slug }: { userId: string; slug: string }) => {
	const [BankData, setBankData] = useState<any | null>(null);
	const router = useRouter();
	const myUserId = useSelector((state: RootState) => state?.userSlice?.user?.user?.id);
	const searchParams = new URLSearchParams(window?.location?.search);
	const t = useTranslations("Bank");
	useEffect(() => {
		const fetchData = async () => {
			try {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("Bank")
				.select(
					`
					label,
					bank_name,
					account_number,
					iban_number,
					bic_swift_code,
					currency`
				)
				.eq("is_active", true)
				.eq("user_id", userId)
				.maybeSingle();

			if (error ) {
				setBankData(null);
				return;
			}
			setBankData(data);
		} catch (err) {
			// console.error("catch error: ", err);
			setBankData(null);
		}
		};
		fetchData();
	}, [BankData, userId]);

	const handleClike = () => {
		if (!BankData) {
			searchParams.set("tab", "Bank");
			const newRelativePathQuery = `/department/${slug}/settings?${searchParams.toString()}`;
			router.push(newRelativePathQuery);
		}
	};
	return (
		<Box>
			<UserProfile propUserId={userId} slug={slug} />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 2,
					alignItems: "center",
					mb: 3,
					mt: 5,
				}}
			>
				<AccountBalanceSharpIcon sx={{ color: "#1976d2" }} />
				<Typography variant="h5" sx={{ fontWeight: "bold" }}>
					{t("Bank account")}
				</Typography>
				{userId === myUserId && (
					<IconButton color="secondary" aria-label="add bank" onClick={handleClike}>
						{BankData ? (
							<CloseSharpIcon sx={{ color: "#f44336", fontSize: 30 }} />
						) : (
							<AddCircleSharpIcon
								sx={{
									color: "#1976d2",
									fontSize: 30,
								}}
							/>
						)}
					</IconButton>
				)}
			</Box>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							{headCells.map((headCell) => (
								<StyledTableCell key={headCell.id}>{t(headCell.label)} </StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{BankData && (
							<TableRow>
								<StyledTableCell> {BankData.label}</StyledTableCell>
								<StyledTableCell>{BankData.bank_name}</StyledTableCell>
								<StyledTableCell>{BankData.account_number}</StyledTableCell>
								<StyledTableCell>{BankData.iban_number}</StyledTableCell>
								<StyledTableCell>{BankData.bic_swift_code}</StyledTableCell>
								<StyledTableCell>{BankData.currency}</StyledTableCell>
							</TableRow>
						)}
					</TableBody>
					{!BankData && <caption>No BAN record</caption>}
				</Table>
			</TableContainer>
		</Box>
	);
};

export default HrAndBank;
