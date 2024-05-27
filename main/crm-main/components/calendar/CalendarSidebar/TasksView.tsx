import React from "react";
import { Box, Paper, Typography, styled } from "@mui/material";
import { Event } from "../types/event";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { lightenColor } from "../components/utils/utilsDesign";

const StyledIcon = styled(ArrowForwardIosIcon)({
  transition: "all .2s ease",
  fontsize: ".8rem",
  ":hover": {
    transform: "translateX(4px)",
  },
  color: "white",
});

const TasksContainer = ({ eventsOfTheDay }: { eventsOfTheDay: Event[] }) => {
  const t = useTranslations("calendar");
  return (
    <Box sx={{ width: 300, overflowY: "auto", padding: "6px"}}>
      <Typography variant="h6">{t("Tasks-of-the-day")}:</Typography>
      <Box mt={1}>
        {eventsOfTheDay.length ? (
          eventsOfTheDay.map((task) => (
            <Link key={task.id} href={`tasks/${task.id}`} style={{textDecoration:'none'}}>
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 1,
                  backgroundColor: lightenColor(task.backgroundColor, 0.1),
                  padding: "2px 6px",
                  ":hover": {
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                    transition: "all .3s ease",
                  }, 
                }}
              >
                <Typography variant="h6" fontSize={".9rem"} sx={{color:'white', fontWeight:'bold'}}>
                  {task.title}
                </Typography>
                <StyledIcon fontSize={"small"} />
              </Paper>
            </Link>
          ))
        ) : (
          <Typography sx={{color:'white'}}>{t("no-tasks")}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default TasksContainer;
