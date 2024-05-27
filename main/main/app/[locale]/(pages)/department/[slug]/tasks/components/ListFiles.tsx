import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, styled, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HighlightOff from "@mui/icons-material/HighlightOff";
import FsLightbox from "fslightbox-react";
import { toast } from "react-toastify";
import NewTaskFileFormUpload from "../utils/NewTaskFileFormUpload";
import { deleteFileForNewTask } from "../[taskId]/TaskImages/actions";
import {
  Description,
  InsertDriveFile,
  PictureAsPdf,
} from "@mui/icons-material";

interface ListFilesProps {
  files: string[];
  fileUrls: string[];
  setFiles: (files: string[]) => void;
  setFileUrls: (fileUrls: string[]) => void;
  folder: string;
}

const StyledFileInput = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "164px",
  minWidth: "164px",
  height: "164px",
  cursor: "pointer",
  borderRadius: ".8rem",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    width: "50%",
    height: "50%",
    color: theme.palette.primary.main,
  },
  "& input": {
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
  },
}));

function FileIcon({ fileType }: any) {
  switch (fileType) {
    case "pdf":
      return <PictureAsPdf style={{ fontSize: "60px" }} />;
    case "docx":
      return <Description style={{ fontSize: "60px" }} />;
    case "xlsx":
      return <InsertDriveFile style={{ fontSize: "60px" }} />;
    default:
      return <Description style={{ fontSize: "60px" }} />;
  }
}

function ListFiles({
  files,
  setFiles,
  fileUrls,
  setFileUrls,
  folder,
}: ListFilesProps) {
  const theme = useTheme();
  const [toggler, setToggler] = useState(false);

  async function handleDeleteFile(fileUrl: string, index: number) {
    const { type } = await deleteFileForNewTask(fileUrl, folder);
    if (type === "error") {
      toast.error("Error deleting file");
    } else {
      toast.success("File deleted successfully");
      const updatedUrls = fileUrls.filter(
        (_: any, idx: number) => idx !== index
      );
      setFileUrls(updatedUrls);
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        display="flex"
        gap="0.6rem"
        pl="0.4rem"
        alignItems="center"
        flexWrap="wrap"
      >
        {fileUrls.map((url: string, index: number) => (
          <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
            {url.endsWith(".pdf") ? (
              <embed
                src={url}
                type="application/pdf"
                width="150px"
                height="150px"
                style={{ borderRadius: "4px" }}
              />
            ) : (
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor: "#f0f0f0",
                }}
                onClick={() => setToggler(!toggler)}
              >
                <FileIcon fileType={url.split(".").pop()} />
              </Box>
            )}
            <Typography
              variant="body2"
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "4px",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              {new URL(url).pathname.split("/").pop()}
            </Typography>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: theme.palette.error.main,
              }}
              onClick={() => handleDeleteFile(url, index)}
            >
              <HighlightOff />
            </IconButton>
          </Box>
        ))}

        <StyledFileInput>
          <AddIcon />
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx"
            onChange={async (event) => {
              const result = await NewTaskFileFormUpload(event, files, folder);
              if (result.type === "success") {
                toast.success("File uploaded successfully");
                setFileUrls([...fileUrls, result.res?.data?.publicUrl]);
              } else {
                toast.error(result.message);
              }
            }}
          />
        </StyledFileInput>
      </Box>
    </Box>
  );
}

export default ListFiles;
