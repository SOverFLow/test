"use client";
import {
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { cyan, red } from "@mui/material/colors";
import { createClient } from "@/utils/supabase/client";

import { useState, ChangeEvent, useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { Comment } from "./utils/types";
import addComment from "@/app/api/comment/actions/add_comment";
import getUserInfo from "@/app/api/comment/actions/get_user_info";
import getTaskComments from "@/app/api/comment/actions/get_task_comments";
import TimeAgo from "./components/TimeAgo";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import deleteComment from "@/app/api/comment/actions/delete_comment";
import { Typography } from "antd";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface CommentsProps {
  taskId: string;
  ChangeStatus?: (status: boolean) => void;
}

export default function Comments(props: CommentsProps) {
  // const [message, setMessage] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<Comment>({
    uid: "",
    id: "",
    task_id: props.taskId,
    created_at: "",
    sender_id: "",
    sender_img: "",
    sender_name: "",
    content: "",
  });
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const [roleName, setRoleName] = useState<string | undefined>("");

  useEffect(() => {
    console.log("page loaded-----------");
  }, []);
  // function for fetching messages
  useEffect(() => {
    async function fetchData() {
      if (!props.taskId || !roleName) {
        return;
      }
      // fetch user info
      getUserInfo().then((data) => {
        if (data?.data) {
          console.log("User info fetched successfully");
          console.log(data);
          setNewComment((prev) => {
            return {
              ...prev,
              sender_id: data.data.id,
              sender_img: data.data.avatar,
              sender_name: data.data.name,
            };
          });
        } else {
          console.log(data?.error);
        }
      });
      startTransition(() => {
        // fetch comments
        getTaskComments(props.taskId).then((data: any) => {
          if (data?.data) {
            console.log("Comments fetched successfully-");
            console.log(data);
            setComments(data?.data);
          } else {
            console.log(data?.error);
          }
        });
      });
    }
    fetchData();
  }, [props.taskId, roleName]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((user) => {
      setRoleName(user.data.user?.role);
      console.log("rolename", user.data.user?.role);
    });
  }, []);

  // function for handling message change
  function handleChangeMsg(event: ChangeEvent<HTMLInputElement>) {
    // setMessage(event.target.value);
    setNewComment({
      ...newComment,
      content: event.target.value,
    });
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMsg();
    }
  };

  function validateMessage(message: string) {
    let errorMessage = "";
    if (!message) {
      errorMessage = "Please type a message";
    } else if (message.length > 1000) {
      errorMessage = "Message too long";
    }
    if (errorMessage) {
      console.log(errorMessage);
      toast(errorMessage, {
        type: "error",
      });
      return false;
    }
    return true;
  }
  // function for sending message
  function handleSendMsg() {
    if (!validateMessage(newComment.content)) {
      return;
    }
    console.log("message", newComment.content);
    startTransition2(() => {
      addComment(newComment).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("Message sent successfully");
          setNewComment({
            ...newComment,
            content: "",
          });
        }
      });
    });
    props.ChangeStatus && props.ChangeStatus(false);
  }

  const supabase = createClient();
  useEffect(() => {
    const commentChanel = supabase
      .channel("realtime:commentChanel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Comment",
          filter: "task_id=eq." + props.taskId,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setComments((prevData) => {
              return prevData.filter(
                (comment) => comment.uid !== payload.old.uid
              );
            });
          } else if (payload.eventType === "INSERT") {
            setComments((prevData) => [
              {
                uid: payload.new.uid,
                id: payload.new.id,
                task_id: payload.new.task_id,
                created_at: payload.new.created_at,
                sender_id: payload.new.sender_id,
                sender_img: payload.new.sender_img,
                sender_name: payload.new.sender_name,
                content: payload.new.content,
              },
              ...prevData,
            ]);
          }
        }
      )
      .subscribe();
    return () => {
      commentChanel.unsubscribe();
    };
  }, [props.taskId, supabase]);

  function handleDelete(comment: Comment): void {
    console.log("delete comment");
    deleteComment(comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Comment deleted successfully");
      }
    });
  }

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        // border: "1px solid red",
      }}
    >
      <Grid
        sx={{
          width: "100%",
          //   borderBottom: "1px solid red",
        }}
      ></Grid>

      <Grid
        sx={{
          width: "100%",
          display: "flex",
          height: 45,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <TextField
          placeholder="Type a message here"
          fullWidth
          variant="outlined"
          value={newComment.content}
          onChange={handleChangeMsg}
          onKeyDown={handleKeyDown}
          sx={{
            height: 45,
            m: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              px: 2,
              py: 0,
              my: 0,
              color: "#181F2E",
            },
          }}
        />
        <IconButton
          disabled={isPending2}
          aria-label="send message"
          onClick={handleSendMsg}
          disableRipple
          disableFocusRipple
          sx={{
            transition: " all 0.2s",
            backgroundColor: cyan[500],
            m: 0,
            ml: 2,
            height: 45,
            width: 45,
            py: 0,
            borderRadius: 2,
            color: "#fff",
            "&:hover": {
              shadow: " 0 0 10px 0 black",
              backgroundColor: cyan[700],
            },
            "&:active": {
              backgroundColor: cyan[900],
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Grid>
      {/* {isPending ? (
        <Paper
          style={{
            padding: "40px 20px",
            width: "100%",
            maxHeight: "30rem",
            overflowY: "scroll",
          }}
        >
          <Grid
            container
            wrap="nowrap"
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Grid>
        </Paper>
      ) : ( */}
      <Paper
        style={{
          padding: "40px 20px",
          width: "100%",
          maxHeight: "30rem",
          overflowY: "scroll",
        }}
      >
        {isPending2 && (
          <Grid
            container
            wrap="nowrap"
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Grid>
        )}
        {comments.map((comment, index) => (
          <Grid key={"coment" + index}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src={comment.sender_img} />
              </Grid>
              <Grid
                justifyContent="left"
                item
                xs
                zeroMinWidth
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "left",
                }}
              >
                <Grid>
                  <h4 style={{ margin: 0, textAlign: "left" }}>
                    {comment.sender_name}
                  </h4>
                  <Typography
                    //  style={{ textAlign: "left" }}
                    style={{
                      // display: "-webkit-box",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // WebkitBoxOrient: "vertical",
                      // WebkitLineClamp: 1,
                      textAlign: "left",
                    }}
                  >
                    {comment.content}
                  </Typography>

                  <TimeAgo timestamp={comment.created_at} />
                </Grid>
                {/* if (roleName !== "super_admin") {
      tabsToRender = tabsToRender.filter((tab) => tab.key !== "Company");
    } */}
                {(comment.sender_id === newComment.sender_id ||
                  roleName === "super_admin") && (
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(comment)}
                    disableRipple
                    disableFocusRipple
                    sx={{
                      transition: " all 0.2s",
                      // backgroundColor: red[400],
                      m: 0,
                      ml: 2,
                      height: 45,
                      width: 45,
                      py: 0,
                      borderRadius: 2,
                      color: red[400],
                      "&:hover": {
                        shadow: " 0 0 10px 0 black",
                        color: red[700],
                      },
                      "&:active": {
                        color: red[900],
                      },
                    }}
                  >
                    <DeleteForeverRoundedIcon
                      sx={{
                        height: 32,
                        width: 32,
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
            )}
          </Grid>
        ))}
      </Paper>
      {/* )} */}
    </Grid>
  );
}
