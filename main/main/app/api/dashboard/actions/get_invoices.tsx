"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { send } from "process";

type Invoice = {
  created_at: string;
  status: string;
};

type InvoiceData = Invoice[];

type chartData = {
  Jan: { paid: number; pending: number; draft: number };
  Feb: { paid: number; pending: number; draft: number };
  Mar: { paid: number; pending: number; draft: number };
  Apr: { paid: number; pending: number; draft: number };
  May: { paid: number; pending: number; draft: number };
  Jun: { paid: number; pending: number; draft: number };
  Jul: { paid: number; pending: number; draft: number };
  Aug: { paid: number; pending: number; draft: number };
  Sep: { paid: number; pending: number; draft: number };
  Oct: { paid: number; pending: number; draft: number };
  Nov: { paid: number; pending: number; draft: number };
  Dec: { paid: number; pending: number; draft: number };
};

const formatData = (data: InvoiceData) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const statuses = ["paid", "pending", "draft"]; // Assuming possible statuses

  // Initialize the result object with all months and statuses set to zero
  const result: { [key: string]: { [key: string]: number } } = {};
  months.forEach((month) => {
    result[month] = {};
    statuses.forEach((status) => {
      result[month][status] = 0;
    });
  });

  // Process each invoice
  data.forEach((invoice) => {
    const date = new Date(invoice.created_at);
    const month = months[date.getMonth()];
    const status = invoice.status;
    result[month][status]++;
  });

  return result;
};

const getInvoinces = async (department_id: string, year: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Using a raw SQL query to extract year part from the created_at timestamp
  const { data, error } = await supabase.rpc("get_invoices_by_year", {
    dept_id: department_id,
    yr: year,
  });
  if (error) {
    console.error(error);
    return { error: error.message };
  } else {
    const formattedData = formatData(data);
    // console.log(formattedData);
    return { data: formattedData };
  }
};

export default getInvoinces;
