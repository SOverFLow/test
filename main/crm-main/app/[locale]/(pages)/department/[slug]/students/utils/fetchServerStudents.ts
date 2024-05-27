import { getDbOnSever } from "@/utils/supabase/cookie";
import { Student } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerStudents(
  department_id: string
): Promise<Student[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Student", [
    "uid",
    "email",
    "first_name",
    "last_name",
    "phone",
    "date_of_birth",
    "level",
    "registration_date",
    "avatar",
    "status",
    "client_id",
    "created_at",
    "budget",
    "address",
    "payment_method",
    "social_security_number",
  ]);
  const { data, error } = await supabase
    .from("Department")
    .select(`department_user_student(Student(${query}))`)
    .eq("uid", department_id)
    .limit(40)
    .single();
  if (error) {
    console.log("error: ", error);
    return;
  }

  // @ts-ignore
  const Students = [];
  const data2 = data as any;
  const studentRelation = data2.department_user_student as any;
  studentRelation.forEach(async (student: any) => {
    Students.push({
      uid: student.Student?.uid ?? "",
      email: student.Student?.email ?? "",
      first_name: student.Student?.first_name ?? "",
      last_name: student.Student?.last_name ?? "",
      phone: student.Student?.phone ?? "",
      date_of_birth: student.Student?.date_of_birth ?? "",
      level: student.Student?.level ?? "",
      registration_date: student.Student?.registration_date ?? "",
      budget: student.Student?.budget ?? "",
      address: student.Student?.address ?? "",
      avatar: student.Student?.avatar ?? "/images/profile.png",
      status: student.Student?.status ?? "",
      client_id: student.Student?.client_id ?? "",
      payment_method: student.Student?.payment_method ?? "",
      social_security_number: student.Student?.social_security_number ?? "",
    });
  });
  // @ts-ignore
  return Students as Student[];
}

export default fetchServerStudents;
