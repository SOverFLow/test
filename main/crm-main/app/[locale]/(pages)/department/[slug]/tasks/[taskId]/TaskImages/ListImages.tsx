"use client";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, IconButton, styled, useTheme } from "@mui/material";
import FsLightbox from "fslightbox-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { deleteImage } from "./actions";

const StyledImageInput = styled(Box)(({ theme }) => ({
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
  "& .MuiSvgIcon-root ": {
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

const StyledContainer = styled(Box)(({ theme }) => ({
  "& .fslightbox-container": {
    position: "fixed",
    zIndex: 100000,
  },
}));

const StyledImage = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "164px",
  minWidth: "164px",
  height: "164px",
  cursor: "pointer",
  borderRadius: ".8rem",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
  "& .MuiButtonBase-root": {
    position: "absolute",
    right: "0",
    top: "0",
    padding: ".2rem",
    margin: ".2rem",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: ".8rem",
  },
}));

interface ListImagesProps {
  images: string[];
  setImages: (images: string[]) => void;
  taskId: string;
  handleImgInput: (event: any) => void;
}

function ListImages({
  images,
  setImages,
  taskId,
  handleImgInput,
}: ListImagesProps) {
  const [mouted, setMouted] = useState(false);
  const [toggler, setToggler] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const theme = useTheme();
  const t = useTranslations("");

  useEffect(() => {
    setMouted(true);
  }, [setMouted]);

  function openImage(index: number) {
    setToggler(!toggler);
    setImgIndex(index);
  }
  async function handleDeleteImage(imgUrl: string) {
    const { type, message, newImages } = await deleteImage(
      imgUrl,
      images,
      taskId
    );
    if (type === "success" && newImages) {
      setImages(newImages);
      toast.success(t("AddTaskForm.Image deleted successfully"));
    } else {
      toast.error(message);
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        display={"flex"}
        gap={".6rem"}
        pl={".4rem"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        {images.map((item, index) => (
          <StyledImage key={item}>
            <Image
              onClick={() => openImage(index)}
              src={item}
              alt="image"
              width={500}
              height={500}
            />
            <IconButton onClick={() => handleDeleteImage(item)}>
              <HighlightOffIcon />
            </IconButton>
          </StyledImage>
        ))}
        <StyledImageInput>
          <>
            <AddIcon />
            <input
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg"
              onChange={handleImgInput}
            />
          </>
        </StyledImageInput>
      </Box>
      {mouted &&
        createPortal(
          <StyledContainer>
            <FsLightbox
              toggler={toggler}
              sources={images || []}
              sourceIndex={imgIndex}
            />
          </StyledContainer>,
          document.body
        )}
    </Box>
  );
}

export default ListImages;
