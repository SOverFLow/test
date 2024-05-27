"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  AvatarGroup,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import TaskTimeline from "@/components/ui/TaskTimeline";
import theme from "@/styles/theme";

interface TaskOfDayProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  avatarUrl: string[];
  worker_id: string[];
  worker_name: string[];
}

export default function TaskOfDay({
  title,
  startTime,
  endTime,
  status,
  avatarUrl,
  id,
  worker_id,
  worker_name,
}: TaskOfDayProps) {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "8px",
        height: "120px",
        minHeight: "fit-content",
        marginX: "auto",
        marginBottom: "8px",
        textDecoration: "none",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        "&&:hover": {
          backgroundColor: "#f5f5f5",
          transition: "0.5s",
        },
      }}
    >
      <AvatarGroup max={2}>
        {worker_id &&
          worker_id?.map((id, index) => (
            <Link
              key={id}
              href={`user/${id}`}
              aria-label={`View details for worker ${id}`}
            >
              <Avatar
                src={avatarUrl[index]}
                alt={worker_name[index].toUpperCase()}
                sx={{ width: 48, height: 48 }}
              />
            </Link>
          ))}
      </AvatarGroup>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flexGrow: 1,
          "&:last-child": { paddingBottom: "8px" },
          padding: "4px",
        }}
      >
        <Typography
          sx={{ fontSize: 16, color: "text.secondary", marginBottom: "8px" }}
        >
          {title}
        </Typography>

        <TaskTimeline start_date={startTime} end_date={endTime} />
      </CardContent>
      <Box>
        <Chip
          label={status}
          sx={{
            height: "24px",
            marginRight: "8px",
            backgroundColor:
              status === "pending"
                ? "#FF4500"
                : status === "in_progress"
                  ? "#FFD700"
                  : "#32CD32",
            fontSize: 10,
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        />
        <Link href={`tasks/${id}`} aria-label={`View details for tasks ${id}`}>
          <Chip
            label="View Details"
            sx={{
              height: "24px",
              marginRight: "8px",
              backgroundColor: theme.palette.primary.light,
              fontSize: 10,
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          />
        </Link>
      </Box>
    </Card>
  );
}
