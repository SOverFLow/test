'use server';
import { getDbOnSever } from "@/utils/supabase/cookie";
import { v4 } from "uuid";

interface Service {
    uid: string;
    image: string;
    title: string;
    family: string;
    buying_price_ht: number;
    selling_price_ht: number;
    tva: number;
    buying_price_ttc: number;
    selling_price_ttc: number;
    units: string;
    reference: string;
    department_id: string;
    created_at: string;
    updated_at: string;
};

function generateProductReference(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";        
    return letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length)) + Math.floor(Math.random() * Math.pow(10, 6)).toString() + letters.charAt(Math.floor(Math.random() * letters.length));
}

const createNewService = async (slug:string,service:Service) => {
    if (!service) {
        console.error("service is required");
        return "service is required";
    }
    const supabase = await getDbOnSever();
    const { error } = await supabase
        .from("Service")
        .insert([
            {
                image: service.image,
                title: service.title,
                family_name: service.family,
                buying_price_ht: service.buying_price_ht,
                selling_price_ht: service.selling_price_ht,
                tva: service.tva,
                buying_price_ttc: service.buying_price_ttc,
                selling_price_ttc: service.selling_price_ttc,
                units: service.units,
                reference: generateProductReference(),
                department_id: slug,
            },
        ]);
    if (error) {
        console.error("error", error);
        return error;
    }
    return null;
}

const uploadServiceImage = async (from: FormData) => {
    const supabase = await getDbOnSever();
    const imgFile = from.get("file");
    if (!imgFile) {
        console.error("File is not an instance of File");
        return { error: "File is not an instance of File", data: null };
    }
    const { error, data } = await supabase.storage
        .from("Photos")
        .upload(`service/${v4()}.webp`, imgFile as File, {
            cacheControl: "1",
            upsert: true,
        });
    if (error) {
        console.error("Error uploading file", error);
        return { error: error.message, data: null };
    }
    const response = supabase.storage.from("Photos").getPublicUrl(data.path);
    console.log("data: ", response.data.publicUrl);
    return { error: null, data: response.data };
}

const createNewFamily = async (slug:string,family:string) => {
    if (!family) {
        console.error("family is required");
        return "family is required";
    }
    const supabase = await getDbOnSever();
    const { error } = await supabase
        .from("ServiceFamily")
        .insert([
            {
                name: family,
                department_id: slug,
            },
        ]);
    if (error) {
        console.error("error", error);
        return error;
    }
    return null;
}

export { uploadServiceImage, createNewFamily };

export default createNewService;