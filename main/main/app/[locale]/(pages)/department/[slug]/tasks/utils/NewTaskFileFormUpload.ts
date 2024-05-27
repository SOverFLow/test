import { uploadFileForNewTask } from "@/utils/supabase/uploadFile";
import { v4 } from "uuid";

interface NewFileFormResult {
    type: string;
    message: string;
    res?: any;
}
export default async function NewTaskFileFormUpload(
    event: any,
    files: string[],
    folder: string
): Promise<NewFileFormResult> {
    console.log("event", event);
    console.log("files", files);
    if (files.length >= 6) {
        return {
            type: "error",
            message: "You can only upload 6 files",
        };
    } else if (
        !event.target.files ||
        !event.target.files[0] ||
        !(event.target.files[0].type.startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || // XLSX
            event.target.files[0].type.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document") || // DOCX
            event.target.files[0].type.startsWith("application/pdf")) // PDF
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
        form.append("file", event.target.files[0]);
        form.append("bucket", "Files");
        form.append("path", `public/${folder}/${v4()}.${event.target.files[0].name.split(".").pop()}`);
        const res = await uploadFileForNewTask(form);
        console.log("res: 00", res);
        if (res?.error) {
            return {
                type: "error",
                message: "Error uploading file",
                res: res,
            };
        }
        return {
            type: "success",
            message: "File form created successfully",
            res: res,
        };
    }
}
