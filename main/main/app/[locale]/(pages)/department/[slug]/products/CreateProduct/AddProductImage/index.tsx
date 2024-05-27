import { Avatar, Box, Fab, Paper, styled } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useEffect, useState } from "react";
import Image from "next/image";

const StyledImageCard = styled(Paper)(({ theme }) => ({
  width: "100px",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& input": {
    opacity: "0",
    width: "100%",
    height: "100%",
  },
  "& .MuiFab-root": {
    "& .MuiSvgIcon-root": {
      position: "absolute",
      pointerEvents: "none",
    },
  },
}));

const StyledImage = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

interface AddProductImageProps {
  setImgFile: (imgFile: File | null) => void;
  image?: string | null;
}

export default function AddProductImage({ setImgFile , image}: AddProductImageProps) {
  const [productImage, setProductImage] = useState<string | null>(null);
  useEffect(() => {
    if (image ) {
      setProductImage(image);
    }
  }
  , [image]);
  
  const handleUploadClick = (event: any) => {
    var file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      setImgFile(file);
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setProductImage(reader.result as string);
      };
    }
  };

  const handleResetClick = (event: any) => {
    setProductImage(null);
    setImgFile(null);
  };

  return (
    <StyledImageCard>
      {productImage ? (
        <StyledImage onClick={handleResetClick}>
          <Image
            width={100}
            height={100}
            src={productImage}
            alt="product image"
          />
        </StyledImage>
      ) : (
        <Fab component="span">
          <input
            accept="image/jpeg,image/png,image/webp"
            id="contained-button-file"
            name="logo"
            type="file"
            onChange={handleUploadClick}
          />
          <AddPhotoAlternateIcon />
        </Fab>
      )}
    </StyledImageCard>
  );
}
