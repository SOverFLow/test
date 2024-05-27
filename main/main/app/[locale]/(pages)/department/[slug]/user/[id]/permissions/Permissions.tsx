import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { fetchNewPermissions, savePermissions } from "../utils/fetch";
import { ObjectStructure } from "../../../workers/utils/types";
import { useTranslations } from "next-intl";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Grid, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import TestCheckBox from "../components/TestCheckBox";


const Permissions = ({ userId, userRole, slug }: { userId: string; userRole: string; slug:string }) => {
	const [isPending, startTransition] = useTransition();
	const [expanded, setExpanded] = useState<string | null>(null);
	const [selectedItems, setSelectedItems] = useState<ObjectStructure>({} as ObjectStructure);
	const [oldItems, setOldItems] = useState<ObjectStructure>({} as ObjectStructure);
	const t = useTranslations("Profile");

	useEffect(() => {
		startTransition(async () => {
			const { data, error } = await fetchNewPermissions(userRole);
			if (error) console.error("Error fetching permissions", error);
			if (data) {
                setSelectedItems(data as ObjectStructure);
                setOldItems(data as ObjectStructure)
            }
		});
	}, [userRole]);

	const handleCheckboxChange = (category: string, item: string, isSelectAll?: boolean) => {
		setSelectedItems((prev) => {
			let newItems = { ...prev };

			if (isSelectAll) {
				Object.keys(newItems[category]).forEach((key) => {
					newItems = {
						...newItems,
						[category]: {
							...newItems[category],
							[key]: !prev[category][item],
						},
					};
				});
				newItems = {
					...newItems,
					[category]: {
						...newItems[category],
						[item]: !prev[category][item],
					},
				};
			} else if (item) {
				newItems = {
					...prev,
					[category]: { ...prev[category], [item]: !prev[category][item] },
				};
				const allSelected = Object.keys(newItems[category]).every((v) => {
					if (v === category) return true;
					return newItems[category][v];
				});

				newItems = {
					...newItems,
					[category]: {
						...newItems[category],
						[category]: allSelected,
					},
				};
			}
			return newItems;
		});
	};

	useEffect(() => {
		// This will be called whenever selectedItems state changes
		if (Object.keys(selectedItems).length === 0) {
			console.log("selectedItems is empty");
			return;
		}
        if (JSON.stringify(selectedItems) === JSON.stringify(oldItems)) return;
		startTransition(async () => {
			const { data, error } = await savePermissions(userId, userRole, selectedItems, slug);
			if (error) console.error("Error saving permissions", error);
		});
	}, [selectedItems, userId, userRole, slug, oldItems]);

	const handleChange = (panel: string) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : null);
	};

	return (
		<>
			{isPending && <CircularProgress />}
			{Object.keys(selectedItems).map((data, index) => (
				<Accordion
					key={index}
					expanded={expanded === `panel${index}`}
					onChange={handleChange(`panel${index}`)}
				>
					<AccordionSummary
						expandIcon={<ExpandMore />}
						aria-controls="permissions-content"
						id="permissions-header"
					>
						<Grid container>
							<Grid item xs={2}>
								<Typography variant="h6">{data}</Typography>
							</Grid>
							{expanded === `panel${index}` && (
								<Grid
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<TestCheckBox
										checked={selectedItems?.[data]?.[data] ? true : false}
										onChange={() => handleCheckboxChange(data, data, true)}
										label={
											<Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis" }}>
												{t('user-can-see-all')}{" "}{data}
											</Typography>
										}
									/>
								</Grid>
							)}
						</Grid>
					</AccordionSummary>
					<AccordionDetails sx={{ padding: "0px 10px" }}>
						<Grid container>
							{Object.keys(selectedItems[data]).map((data2, index2) => {
								if (data2 === data) return null;
								let selected: boolean = false;
								let isSelectAll = false;
								if (data2 === data) isSelectAll = true;
								if (selectedItems[data]) selected = selectedItems[data][data2];
								return (
									<Grid container key={index2}>
										<Grid item xs={2}></Grid>
										<Grid item xs={10}>
											<TestCheckBox
												checked={selected}
												onChange={() => handleCheckboxChange(data, data2, isSelectAll)}
												label={<Typography>{t('user-can-view-only')}{" "}{data2}</Typography>}
											/>
										</Grid>
									</Grid>
								);
							})}
						</Grid>
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
};

export default Permissions;