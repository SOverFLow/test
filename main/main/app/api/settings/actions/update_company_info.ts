"use server";
import { CompanyInfoSchema } from "@/schemas/zod/zod.CompanyInfo";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Upload a file to the supabase storage
async function uploadFile(file: File, bucket: string, path: string) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
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
    console.error(
      "An error occurred while updating company profile image",
      error
    );
    return { error: "An error occurred while updating company profile image" };
  }
}

// Remove a file from the supabase storage
async function removeFile(file: File, bucket: string, path: string) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    console.log("data", data);
    if (error) {
      console.error("Error deleting file", error);
      return { error: error.message };
    }
  } catch (error) {
    console.error(
      "An error occurred while updating company profile image",
      error
    );
    return { error: "An error occurred while updating company profile image" };
  }
}

// Extract the ID from the image URL
function getLogod(imageUrl: string) {
  if (!imageUrl) {
    return null;
  }
  const startIndex = imageUrl.lastIndexOf("logo_");
  const logoId = imageUrl.substring(startIndex);
  return logoId;
}
// siret capital conditions_bank
// function to validate the data
function validateData(formData: FormData) {
  const profileDataTmp = {
    companyLogo: formData.get("companyLogo") as File | string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    website: formData.get("website") as string,
    note: formData.get("note") as string,
    siret: formData.get("siret") as string,
    capital: formData.get("capital") as string,
    conditions_bank: formData.get("conditions_bank") as string,
  };
  const profileData = {
    name:
      profileDataTmp.name !== "null" && profileDataTmp.name !== "undefined"
        ? profileDataTmp.name
        : null,
    companyLogo:
      profileDataTmp.companyLogo !== "null" &&
      profileDataTmp.companyLogo !== "undefined"
        ? profileDataTmp.companyLogo
        : null,
    email:
      profileDataTmp.email !== "null" && profileDataTmp.email !== "undefined"
        ? profileDataTmp.email
        : null,
    phone:
      profileDataTmp.phone !== "null" && profileDataTmp.phone !== "undefined"
        ? profileDataTmp.phone
        : null,
    address:
      profileDataTmp.address !== "null" &&
      profileDataTmp.address !== "undefined"
        ? profileDataTmp.address
        : null,
    website:
      profileDataTmp.website !== "null" &&
      profileDataTmp.website !== "undefined"
        ? profileDataTmp.website
        : null,
    note:
      profileDataTmp.note !== "null" && profileDataTmp.note !== "undefined"
        ? profileDataTmp.note
        : null,
    siret:
      profileDataTmp.siret !== "null" && profileDataTmp.siret !== "undefined"
        ? profileDataTmp.siret
        : null,
    capital:
      profileDataTmp.capital !== "null" &&
      profileDataTmp.capital !== "undefined"
        ? profileDataTmp.capital
        : null,
    conditions_bank:
      profileDataTmp.conditions_bank !== "null" &&
      profileDataTmp.conditions_bank !== "undefined"
        ? profileDataTmp.conditions_bank
        : null,
  };
  const validatedFields = CompanyInfoSchema.safeParse(profileData);
  if (!validatedFields.success) {
    return {
      error:
        "s-" +
        validatedFields.error.errors[0].path +
        ": " +
        validatedFields.error.errors[0].message,
    };
  }
  return { data: validatedFields.data };
}

// this is the server-side action for updating the public profile
const updateCompanyInfo = async (formData: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const logoId = "logo_" + uuidv4();
  let logo;

  // validate the fields in the server side
  const validatedFields = validateData(formData);
  if (validatedFields.error) {
    return { error: validatedFields.error };
  }
  // siret capital conditions_bank
  const {
    name,
    companyLogo,
    email,
    phone,
    address,
    website,
    note,
    siret,
    capital,
    conditions_bank,
  } = validatedFields.data ?? {
    siret: null,
    capital: null,
    conditions_bank: null,
    name: null,
    companyLogo: null,
    email: null,
    phone: null,
    address: null,
    website: null,
    note: null,
  };

  if (companyLogo) {
    // remove the old logo
    const logoUrl = await supabase
      .from("Company")
      .select("logo")
      .eq("super_admin_id", user.data.user?.id);
    if (!logoUrl.error) {
      const oldLogod = getLogod(logoUrl.data[0].logo);
      if (oldLogod) {
        removeFile(companyLogo, "Photos", `CompanyLogo/${oldLogod}`);
      }
    }

    // upload the new logo
    const uploadResponse = await uploadFile(
      companyLogo,
      "Photos",
      `CompanyLogo/${logoId}`
    );
    if (uploadResponse?.error) {
      console.error(uploadResponse.error);
      return { error: uploadResponse.error };
    } else {
      logo = uploadResponse?.data?.publicUrl;
    }
  }
  // update the profile
  const updateResponse = await supabase
    .from("Company")
    .update({
      name,
      email,
      address,
      logo,
      phone,
      website,
      note,
      siret,
      capital,
      conditions_bank,
    })
    .eq("super_admin_id", user.data.user?.id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    return { success: "Company profile has been updated!" };
  }
};

export default updateCompanyInfo;
