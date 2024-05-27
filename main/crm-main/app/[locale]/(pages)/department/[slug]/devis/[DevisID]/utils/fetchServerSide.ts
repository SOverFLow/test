"use server";

import { getDbOnSever } from "@/utils/supabase/cookie";

const getInvoiceData = async (InvoiceID: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Invoice")
    .select(
      "title,date_issued,due_date,currency,\
        Company(logo,name,address,country,city,zip_code),\
        Client(first_name,last_name,address,city,country, email),\
        Task(Product(notes,quantity,sell_price),\
      selected_products_out_stock,selected_products_in_stock,services)"
    )
    .eq("uid", InvoiceID);
    console.log("data33: ", data);
    console.log("error33: ", error);
    if (!data) return {};
    const in_stock = data[0].Task?.selected_products_in_stock?.map((product:any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        rate: product?.sell_price.toString() as string,
      };
    }
    );
    const out_stock = data[0].Task?.selected_products_out_stock?.map((product:any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        rate: product?.sell_price?.toString() as string,
      };
    });
    const services = data[0].Task?.services?.map((product:any) => {
      return {
        description: product?.selection?.title as string,
        quantity: product?.quantity?.toString() as string,
        rate: product?.selection?.selling_price?.toString() as string,
      };
    });
  const returnData = {
    logo: data[0].Company?.logo as string,
    title: data[0].title as string,
    companyName: data[0].Company?.name as string,
    companyAddress: data[0].Company?.address as string,
    companyAddress2: (data[0].Company?.city +
      " " +
      data[0].Company?.zip_code) as string,
    companyCountry: data[0].Company?.country as string,
    clientName: (data[0].Client?.first_name +
      " " +
      data[0].Client?.last_name) as string,
    clientAddress: data[0].Client?.address as string,
    clientAddress2: data[0].Client?.city as string,
    clientCountry: data[0].Client?.country as string,
    clientEmail: data[0].Client?.email as string,
    invoiceTtile: data[0].title as string,
    invoiceDate: data[0].date_issued as string,
    invoiceDueDate: data[0].due_date as string,
    currency: data[0].currency as string,
    productLines: [...(services || []),...(in_stock || []), ...(out_stock || [])]
  };
  return returnData;
};

const getAllInvoices = async (department_id: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Invoice")
    .select("uid,reference,title,date_issued,invoice_price,status,currency")
    .eq("department_id", department_id);
  if (!data) return [];
  const statusFormat = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  const returnData = data.map((invoice) => {
    return {
      uid: invoice.uid as string,
      id: invoice.reference as string,
      name: invoice.title as string,
      startDate: invoice.date_issued as string,
      amount: `${invoice.currency?.toString()}${invoice.invoice_price?.toString()}`,
      status: statusFormat(invoice.status?.toString() as string),
    };
  });
  return returnData;
};

const getIfDepartmentIsFormation = async (slug: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Department")
    .select("is_center_formation")
    .eq("uid", slug);
  if (!data) return false;
  if (error) {
    console.log(error);
    return false;
  }
  return data[0].is_center_formation as boolean;
};
export default getInvoiceData;
export { getAllInvoices, getIfDepartmentIsFormation };
