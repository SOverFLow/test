"use server";
import { BankTabSchema } from "@/schemas/zod/zod.BankTab";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { z } from "zod";

const addBank = async (values: z.infer<typeof BankTabSchema>) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  const validatedFields = BankTabSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;

  const updateResponse = await supabase.from("Bank").insert([
    {
      label: data.Label,
      bank_name: data["Bank name"],
      currency: data.Currency,
      country: data.Country,
      account_number: data["Account number"],
      iban_number: data["IBAN number"],
      bic_swift_code: data["BIC/SWIFT code"],
      bank_address: data["Bank address"],
      account_owner_name: data["Account owner name"],
      account_owner_address: data["Account owner address"],
      // worker_id: user.data.user?.id,
    },
  ]);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    return { success: "your Bank has been added!" };
  }
};

export default addBank;
