"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserProfile from "../components/profile";
import { Box } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

export default function Profile() {
	const userId = useSelector((state: RootState) => state?.userSlice?.user?.user?.id);
	const pathname = usePathname();
	const slug = pathname.split("/")[3];

	return (
		<Box sx={{ mt: 5, ml: 6 }}>
			<UserProfile propUserId={userId} slug={slug} />
		</Box>
	);
}
