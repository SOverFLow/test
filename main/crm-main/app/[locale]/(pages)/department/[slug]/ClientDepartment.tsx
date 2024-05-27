"use client";
import { Box, Card, CardContent, Chip, Grid, Typography, styled } from "@mui/material";
import EditDepartment from "./components/EditDepartment";
import DeleteDepartment from "./components/DeleteDepartment";
import { useEffect, useState } from "react";
import Link from "next/link";
import formatDate from "@/utils/formatDate";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface DepartmentData {
  uid: string;
  title: string;
  description: string | null;
  created_at: string;
  info: {
    name: string;
    count: number;
    link: string;
  }[];
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.card?.main,
  transition: "all 0.5s",
  "&:hover": {
    transform: "scale(1.01)",
  }
}));

export default function ClientDepartment({
  initialData,
}: {
  initialData: DepartmentData;
}) {
  const [data, setData] = useState(initialData);
  const [date, setDate] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setDate(formatDate(new Date(data.created_at)));
  }, [data.created_at]);

  useEffect(() => {
    supabase
      .channel("realtime:department")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Department",
          filter: `uid=eq.${data.uid}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setData((prevData) => ({
              ...prevData,
              title: payload.new.title,
              description: payload.new.description,
            }));
          } else if (payload.eventType === "DELETE") {
            router.push("/404");
          }
        }
      )
      .subscribe();
    () => {
      supabase.channel("realtime:department").unsubscribe();
    };
  });
  return (
    <div style={{ margin: "20px" }}>
      <Grid container spacing={4}>
        <Grid item container xs={12} spacing={2}>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Typography variant="h4">{data.title}</Typography>
            <Box display={"flex"} gap={".4rem"}>
              <EditDepartment departmentId={data.uid} />
              <DeleteDepartment departmentId={data.uid} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" maxWidth={600}>
              {data.description}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={3}>
          {data.info.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Link href={item.link}>
                <StyledCard>
                  <CardContent>
                    <Typography fontSize={"1.2rem"}>{item.name}</Typography>
                    <Typography fontSize={".9rem"}>{item.count}</Typography>
                  </CardContent>
                </StyledCard>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"end"}>
          <Chip color="primary" label={date} />
        </Grid>
      </Grid>
    </div>
  );
}
