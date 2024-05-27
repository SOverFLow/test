import { createClient } from "@/utils/supabase/client";
import uploadFile from "@/utils/supabase/uploadFile";
import convertImageToWebP from "@/utils/webPconverter";
import { v4 } from "uuid";

async function addNewImage(
  event: any,
  task_uid: string,
  images: string[]
): Promise<{ type: string; message: string; newImg?: string }> {
  console.log("event", event);
  console.log("task_uid", task_uid);
  console.log("images", images);
  if (images.length >= 6) {
    return {
      type: "error",
      message: "You can only upload 6 images",
    };
  } else if (
    !event.target.files ||
    !event.target.files[0] ||
    !event.target.files[0].type.startsWith("image")
  ) {
    return {
      type: "error",
      message: "Invalid file type",
    };
  } else if (event.target.files[0].size > 10000000) { // 10MB
    return {
      type: "error",
      message: "File size is too big",
    };
  } else {
    const form = new FormData();
    const result = await convertImageToWebP(event.target.files[0]);
    form.append("file", result as any);
    form.append("bucket", "Photos");
    form.append("path", `public/task/${v4()}.webp`);
    form.append("uid", `${task_uid}`);
    form.append("tableName", "Task");
    const { data, error } = await uploadFile(form);
    if (error) {
      console.log("error after uploadFile: ", error);
    }
    if (data?.publicUrl) {
      return {
        type: "success",
        message: "Image uploaded successfully",
        newImg: data.publicUrl,
      };
    }
    return {
      type: "error",
      message: "Error uploading image",
    };
  }
}

async function deleteImage(imgUrl: string, images: string[], taskId: string) {
  const supabase = createClient();
  const { error: storageError } = await supabase.storage
    .from("Photos")
    .remove([
      `public/task/${imgUrl.split("/").slice(-1).join("").split("?")[0]}`,
    ]);
  if (storageError) {
    console.error("Error deleting image1", storageError);
    return {
      type: "error",
      message: "Error deleting image",
    };
  }
  const newImages = images.filter((img) => img !== imgUrl);
  const { error } = await supabase
    .from("Task")
    .update({ images: newImages })
    .eq("uid", taskId);
  if (error) {
    console.error("Error deleting image2", error);
    return {
      type: "error",
      message: "Error deleting image",
    };
  }
  return {
    type: "success",
    message: "Image deleted successfully",
    newImages,
  };
}


async function deleteImageForNewTask(imgUrl: string, folder: string) {
  const supabase = createClient();
  const { error: storageError } = await supabase.storage
    .from("Photos")
    .remove([
      `public/${folder}/${imgUrl?.split("/")?.slice(-1)?.join("")?.split("?")[0]}`,
    ]);
  if (storageError) {
    console.error("Error deleting image1", storageError);
    return {
      type: "error",
      message: "Error deleting image",
    };
  }
  return {
    type: "success",
    message: "Image deleted successfully",
  };
}

async function deleteFileForNewTask(fileUrl: string, folder: string) {
  const supabase = createClient();
  if (!fileUrl) {
    return {
      type: "error",
      message: "Invalid file url",
    };
  }
  const { error: storageError } = await supabase.storage
    .from("Files")
    .remove([
      `public/${folder}/${fileUrl?.split("/").slice(-1).join("").split("?")[0]}`,
    ]);
  console.log("storageError", storageError);
  if (storageError) {
    console.error("Error deleting ", storageError);
    return {
      type: "error",
      message: "Error deleting file",
    };
  }
  return {
    type: "success",
    message: "File deleted successfully",
  };
}

export { addNewImage, deleteFileForNewTask, deleteImage, deleteImageForNewTask };

// export default addNewImage;
