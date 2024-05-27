import { uploadFileForNewTask } from "@/utils/supabase/uploadFile";
import convertImageToWebP from "@/utils/webPconverter";
import { v4 } from "uuid";

interface NewImageFormResult {
  type: string;
  message: string;
  newImg?: string;
  res?: any;
  folder?: string;
}

async function NewImageForm(
  event: any,
  images: string[],
  folder: string
): Promise<NewImageFormResult> {
  console.log("event", event);
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
    form.append("path", `public/${folder}/${v4()}.webp`);
    const res = await uploadFileForNewTask(form);
    console.log("res: ", res);
    if (res.error) {
      return {
        type: "error",
        message: "Error uploading image",
        res: res,
      };
    }
    return {
      type: "success",
      message: "Image form created successfully",
      res: res,
    };
  }
}

export default NewImageForm;