"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

type Question = {
  id: number;
  newAnswer: string;
  questionText: string;
  answers: Answer[];
};

type Answer = {
  answerText: string;
  id: number;
};
const updateQcm = async (
  formData: Question[],
  departement_id: string,
  evaluationType: string
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (departement_id === "") {
    return { error: "No department id provided" };
  }
  formData.pop();
  const qcmData = formData.map((question) => {
    const { newAnswer, ...rest } = question;
    return rest;
  });

  const updateResponse = await supabase
    .from("DepartmentSettings")
    .update({
      [evaluationType]: qcmData,
    })
    .eq("department_id", departement_id);

  if (updateResponse.error) {
    console.error(updateResponse.error);
    return { error: updateResponse.error.message };
  } else {
    console.log("updateResponse", updateResponse);
    return { success: "Company profile has been updated!" };
  }
};

export default updateQcm;
