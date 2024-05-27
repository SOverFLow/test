import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ListFiles from "./ListFiles";

interface ListFilesForNewTaskProps {
  files: string[];
  setFiles: (files: string[]) => void;
  ChangeFiles?: (files: string[], urls: string[]) => void;
  folder: string;
}

export default function ListFilesForNewTask({
  ChangeFiles,
  files,
  setFiles,
  folder
}: ListFilesForNewTaskProps) {
  const t = useTranslations("");
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    setUrls(files);
  }, [files]);


  useEffect(() => {
    if (ChangeFiles) {
      ChangeFiles(files, urls);
    }
  }, [files, urls, ChangeFiles]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box display="flex" alignItems="center" gap="0.2rem" marginTop={2}>
        <Typography variant="h5" fontWeight="600">
          {t("AddTaskForm.Other files")}
        </Typography>
      </Box>
      <Box mt={2}>
        <ListFiles
          files={files}
          fileUrls={urls}
          setFiles={setFiles}
          setFileUrls={setUrls}
          folder={folder}
        />
      </Box>
    </Box>
  );
}
