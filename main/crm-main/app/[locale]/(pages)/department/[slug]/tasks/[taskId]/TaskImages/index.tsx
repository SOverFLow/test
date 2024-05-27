"use client";
import { Box, IconButton, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import ListImages from "./ListImages";
import { useTranslations } from "next-intl";
import { addNewImage } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

interface TaskImagesProps {
  taskId: string;
  ChangeStatus?: (status: boolean) => void;
}

export default function TaskImages(props : TaskImagesProps) {
  const supabase = createClient();
  const t = useTranslations("Task");
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    supabase
      .from("Task")
      .select("images")
      .eq("uid", props.taskId)
      .then(({ data, error }) => {
        data && setImages(data[0].images || []);
        if (error) {
          console.log("Error: ", error);
        }
      });
  }, [supabase, props.taskId]);

  const handleImgInput = async (event: any) => {
    const { type, message, newImg } = await addNewImage(event, props.taskId, images);
    if (type === "success" && newImg) {
      toast.success("Image uploaded successfully");
      setImages([...images, newImg]);
      props.ChangeStatus && props.ChangeStatus(false);
    } else {
      toast.error(message);
    }
  };

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} gap={".2rem"}>
        <Typography variant="h5" fontWeight={"semi-bold"}>
          {t("images")}
        </Typography>
      </Box>
      <Box mt={2} display={"flex"} flexWrap={"wrap"} gap={".6rem"}>
        <ListImages
          images={images}
          setImages={setImages}
          taskId={props.taskId}
          handleImgInput={handleImgInput}
        />
      </Box>
    </Box>
  );
}
