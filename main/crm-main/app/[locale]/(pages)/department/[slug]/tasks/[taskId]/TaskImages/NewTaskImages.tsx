import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ListImagesForNewTask from "./ListImagesForNewTask";

interface TaskImagesProps {
  images: string[];
  setImages: (images: string[]) => void;
  ChangeImages?: (images: string[], imagesUrl: string[]) => void;
  folder: string;
  table?: string;
}

export default function NewTaskImages({
  images,
  setImages,
  ChangeImages,
  folder,
  table,
}: TaskImagesProps) {
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const t = useTranslations("Task");

  useEffect(() => {
    ChangeImages && ChangeImages(images, imagesUrl);
  }, [images, imagesUrl,ChangeImages]);

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} gap={".2rem"}>
        <Typography variant="h5" fontWeight={"600"}>
          {t("images")}
        </Typography>
      </Box>
      <Box mt={2}>
        <ListImagesForNewTask
          images={images}
          urls={imagesUrl}
          setImages={setImages}
          setImagesUrl={setImagesUrl}
          folder={folder}
          table={table}
        />
      </Box>
    </Box>
  );
}
