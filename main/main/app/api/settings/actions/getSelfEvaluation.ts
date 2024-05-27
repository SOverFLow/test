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

export const getSelfEvaluation = async (departmentId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("DepartmentSettings")
      .select("self_evaluation")
      .eq("department_id", departmentId)
      .single();
    if (error) {
      return { error: "An error occurred while fetching qcm" };
    } else {
      console.log("data", data);
      return { success: data };
    }
  }
};
