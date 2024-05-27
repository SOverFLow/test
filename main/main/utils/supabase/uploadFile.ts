"use server";
import { cookies } from "next/headers";
import { createClient } from "./server";

const cookieStore = cookies();
const supabase = createClient(cookieStore);
const uploadFile = async (from: FormData) => {
  try {
    const file = from.get("file");
    console.error("file: ", file);
    console.error("file instanceof File: ", file);
    console.error("1: ", 1);
    if (!file) {
      console.error("File is not an instance of File");
      return { error: "File is not an instance of File" };
    }
    console.error("2: ");
    const bucket = from.get("bucket") as string;
    const path = from.get("path") as string;
    const uid = from.get("uid") as string;
    const oldPath = from.get("oldPath") as string;
    const tableName = from.get("tableName") as string;

    console.log("bucket: ", bucket);
    console.log("path: ", path);
    console.log("uid: ", uid);
    console.log("tableName: ", tableName);
    console.log("file: ", file);
    console.log("oldPath: ", oldPath);
    if (!bucket || !path || !uid || !tableName || !file) {
      console.error("Bucket, path, uid, or tablename is not provided");
      return { error: "Bucket, path, uid, or tablename is not provided" };
    }

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "1",
      upsert: true,
    });
    console.error("3: ");

    if (error) {
      console.error("Error uploading file", error);
      return { error: error.message };
    } else {
      const response = supabase.storage.from(bucket).getPublicUrl(path);
      const data: { publicUrl: string } = response.data as {
        publicUrl: string;
      };

      if (
        tableName === "SuperAdmin" ||
        tableName === "UserWorker" ||
        tableName === "Client" ||
        tableName === "Student"
      ) {
        console.log("tableName: ", tableName);
        const result = await uploadFileForProfile({
          tableName,
          data,
          uid,
          bucket,
          oldPath,
        });
        if (result && result.error) {
          console.error("Error updating profile picture", result.error);
          return { error: result.error };
        }
      } else if (tableName === "Task") {
        const result = await uploadFileForTask(uid, data.publicUrl);
        if (result && result.error) {
          console.error("Error inserting Task image", result.error);
          return { error: result.error };
        }
      } else {
        console.error("Invalid table name");
        return { error: "Invalid table name" };
      }
      return { data };
    }
  } catch (error) {
    console.error("An error occurred while updating your profile image", error);
    return { error: "An error occurred while updating your profile image" };
  }
};

export default uploadFile;

export const uploadFileForNewTask = async (from: FormData) => {
  try {
    const file = from.get("file");
    console.error("file: ", file);
    console.error("file instanceof File: ", file);
    console.error("1: ", 1);
    if (!file) {
      console.error("File is not an instance of File");
      return { error: "File is not an instance of File" };
    }
    console.error("2: ");
    const bucket = from.get("bucket") as string;
    const path = from.get("path") as string;
    const oldPath = from.get("oldPath") as string;

    console.log("bucket: ", bucket);
    console.log("path: ", path);
    console.log("file: ", file);
    console.log("oldPath: ", oldPath);
    if (!bucket || !path || !file) {
      console.error("Bucket, path, is not provided");
      return { error: "Bucket, path, is not provided" };
    }

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "1",
      upsert: true,
    });
    console.error("3: ");

    if (error) {
      console.error("Error uploading file", error);
      return { error: error.message };
    } else {
      const response = supabase.storage.from(bucket).getPublicUrl(path);
      const data: { publicUrl: string } = response.data as {
        publicUrl: string;
      };
      return { data };
    }
  } catch (error) {
    console.error("An error occurred while uploading image", error);
    return { error: "An error occurred while uploading image" };
  }
};

const uploadFileForProfile = async ({
  tableName,
  data,
  uid,
  bucket,
  oldPath,
}: {
  tableName: string;
  data: {
    publicUrl: string;
  };
  uid: string;
  bucket: string;
  oldPath: string;
}) => {
  console.log("tableName2: ", tableName);

  const { error } = await supabase
    .from(tableName as any)
    .update({ avatar: data.publicUrl })
    .eq("uid", uid);

  if (!error && oldPath) {
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([
        `public/profile/${oldPath.split("/").slice(-1).join("").split("?")[0]}`,
      ]);

    if (deleteError) {
      console.error("Error deleting old file", deleteError);
      return { error: deleteError.message };
    }
  }
};

const uploadFileForTask = async (uid: string, imageUrl: string) => {
  const { data } = await supabase.from("Task").select("images").eq("uid", uid);
  if (!data || data.length === 0) {
    return { error: "Task not found" };
  }
  const images = data[0].images;
  const newImages = images ? [...(images as string[]), imageUrl] : [imageUrl];

  const { error } = await supabase
    .from("Task")
    .update({ images: newImages })
    .eq("uid", uid);
  if (error) {
    console.error("Error updating task image", error);
    return { error: error.message };
  }
};
