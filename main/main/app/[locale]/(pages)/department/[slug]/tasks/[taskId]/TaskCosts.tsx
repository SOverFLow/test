"use client";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface TaskCostsProps {
  costs: {
    uid: string;
    name: string;
    price: number;
    date_issued: string | null;
    status: string;
    type: string;
    description: string | null;
  }[];
}

export default function TaskCosts({ costs }: TaskCostsProps) {
  const t = useTranslations("Task");
  return (
      <List>
        {costs ? costs.map((item) => (
          <ListItem key={item.uid}>
            <ListItemText
              primary={item.name}
              secondary={`${item.price}$`}
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
          </ListItem>
        )) : 
        (
          <Typography>no costs found</Typography>
        )}
      </List>
  );
}
