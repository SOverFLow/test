import { getDbOnSever } from "@/utils/supabase/cookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("request", request);
  
  const supabase = await getDbOnSever();
  // const {data, error} = await supabase.auth.getUser();
  const {data, error} = await supabase.from("Department").select("uid,department_user_worker(user_worker_id,UserWorker(uid,email))").eq('uid',"c58a6f3d-6dc2-44d4-b670-e212e2746090");
  console.log("data", data);
  console.log("error", error?.message);

  return NextResponse.json({ message: {data} }, { status: 201 });

};


