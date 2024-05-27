"use client";
import { Avatar, Box, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import FemaleSharpIcon from "@mui/icons-material/FemaleSharp";
import MaleSharpIcon from "@mui/icons-material/MaleSharp";
import { useEffect, useState } from "react";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { getColumns, TableType } from "../utils/tableColumns";
import { useTranslations } from "next-intl";

interface Department {
	currency: string;
}

interface SupabaseResponse<T> {
	data: T | null;
	error: Error | null;
}

const UserProfile = ({ propUserId, slug }: { propUserId?: string; slug: string }) => {
	const [userData, setUserData] = useState<any>(null);
	const [currency, setCurrency] = useState<any | null>("");
	const [redirectTo404, setRedirectTo404] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	const rolename = useSelector((state: RootState) => state?.userSlice?.user?.user?.role);
	const t = useTranslations("Profile");
	const userId = propUserId;
	const router = useRouter();
	const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.src = "./images/avatar.png";
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				let query;
				if (!userId) return;
					const supabase = createClient();
					let { data: table, error: tableError } = await supabase.rpc("get_user_table", {
						user_uid: userId,
					});
				if (tableError) {
					setRedirectTo404(true);
				}
				let columns = getColumns(table as TableType);
				if (rolename && table) {
					query = await getTablePermissionForSpecificRows(
						rolename as string,
						table as string,
						columns
					);
					if (query == undefined) setRedirectTo404(true);
					const { data, error } = await supabase
						.from(table as "SuperAdmin" | "UserWorker" | "Client")
						.select(query as string)
						.eq("uid", userId)
						.single();

					const response = (await supabase
						.from("Department")
						.select("currency")
						.eq("uid", slug)
						.maybeSingle()) as SupabaseResponse<Department>;

					if (response.data) {
						setCurrency(response.data.currency);
					}
					setUserData(data);
				}
			} catch (err) {
				setRedirectTo404(true);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [rolename, userId, slug]);

	useEffect(() => {
		if (redirectTo404) {
			router.push("/404");
		}
	}, [redirectTo404, router]);

	const filteredEntries = userData
		? Object.entries(userData).filter(([key, _]) => key !== "avatar")
		: [];

	const firstPart = filteredEntries.slice(0, 10);
	const secondPart = filteredEntries.slice(10, 21);

	const renderEntries = (entries: any) =>
		entries
			.filter(([_, value]: [string, any]) => value !== null && value !== undefined)
			.map(([key, value]: [string, any]) => (
				<Box key={key}>
					<Divider sx={{ mb: 1, mt: 1 }} />
					<Grid container>
						<Grid item md={6}>
							<Typography key={key} sx={{ fontWeight: 600, color: "#1976d2", ml: 2 }}>
								{t(key)}
							</Typography>
						</Grid>
						<Grid item md={6}>
							<Typography key={value} sx={{ color: "#424242" }}>
								{String(value)}{" "}
								{(key === "salary_hour" || key === "salary_day") && currency
									? String(currency)
									: ""}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			));

	if (!userData || loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", mb: 3 }}>
				<Avatar
					alt="portrait"
					sx={{ width: 100, height: 100 }}
					onError={handleImgError}
					src={userData?.avatar ?? ""}
				></Avatar>
				<Typography variant="h4" sx={{ fontWeight: "bold" }}>
					{userData?.first_name} {userData?.last_name}
				</Typography>
				{userData?.gender == "male" && <MaleSharpIcon color="primary" sx={{ fontSize: 30 }} />}
				{userData?.gender == "female" && (
					<FemaleSharpIcon sx={{ color: "#ec407a", fontSize: 30 }} />
				)}
			</Box>
			<Grid container spacing={6}>
				<Grid item md={6}>
					{renderEntries(firstPart)}
				</Grid>
				<Grid item md={6}>
					{renderEntries(secondPart)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default UserProfile;
