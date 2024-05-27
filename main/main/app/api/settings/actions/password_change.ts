"use server";
import { PasswordChangeCardSchema } from "@/schemas/zod/zod.passwordChangeCard";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { z } from "zod";

// this is the server-side action for login
const passwordChange = async (
  values: z.infer<typeof PasswordChangeCardSchema>
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // validate the fields in the server side
  const validatedFields = PasswordChangeCardSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  // here we change the user password
  const { currentPassword, newPassword } = validatedFields.data;

  // Verify the current password
  const verifyResponse = await supabase.rpc("verify_user_password", {
    password: currentPassword,
  });

  // Update to the new password if the old one is correct
  if (verifyResponse.data === true) {
    const updateResponse = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateResponse.error) {
      console.error(updateResponse.error);
      return { error: updateResponse.error.message };
    } else {
      return { success: "Password updated!" };
    }
  } else {
    return { error: "Invalid current password!" };
  }
};

export default passwordChange;
