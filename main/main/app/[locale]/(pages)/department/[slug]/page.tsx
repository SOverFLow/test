import { getDbOnSever } from "@/utils/supabase/cookie";
import ClientDepartment from "./ClientDepartment";

async function fetchDepartmentData(departmentId: string) {
  const supabase = await getDbOnSever();
  const { data: department, error: err1 } = await supabase
    .from("Department")
    .select(
      "*, department_user_worker(UserWorker(uid)), Client(uid), Contact(uid), Task(uid), Product(uid), Stock(uid), Supplier(uid), Bien(uid)"
    )
    .eq("uid", departmentId)
    .single();
  if (err1) {
    console.log(err1);
    return;
  }
  return {
    uid: department.uid,
    title: department.title,
    description: department.description,
    created_at: department.created_at,
    info: [
      {
        name: "Workers",
        count: department.department_user_worker.length,
        link: `${departmentId}/workers`,
      },
      {
        name: "Clients",
        count: department.Client.length,
        link: `${departmentId}/clients`,
      },
      {
        name: "Contacts",
        count: department.Contact.length,
        link: `${departmentId}/contacts`,
      },
      { name: "Tasks", count: department.Task.length, link: `${departmentId}/tasks` },
      {
        name: "Stocks",
        count: department.Stock.length,
        link: `${departmentId}/stocks`,
      },
      {
        name: "Products",
        count: department.Product.length,
        link: `${departmentId}/products`,
      },
      {
        name: "Suppliers",
        count: department.Supplier.length,
        link: `${departmentId}/suppliers`,
      },
      { name: "Biens", count: department.Bien.length, link: `${departmentId}/biens` },
    ],
  };
}

export default async function Department({
  params,
}: {
  params: { slug: string };
}) {
  const data = await fetchDepartmentData(params.slug);
  if (!data) {
    return <div>Department not found</div>;
  }
  return (
    <ClientDepartment initialData={data} />
  );
}
