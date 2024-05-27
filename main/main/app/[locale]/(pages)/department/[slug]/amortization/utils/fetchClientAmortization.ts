import { createClient } from "@/utils/supabase/client";
import { Amortization } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { toast } from "react-toastify";

async function ClientFetchAmortizationLazy(
  department_id: string,
  count: number,
  page: number
): Promise<Amortization[] | undefined> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(
    user.role,
    "Amortization",
    [
      "uid",
      "accumulated_depreciation",
      "acquisition_date",
      "book_value",
      "depreciation_installment",
      "first_year_useful_life",
      "last_year_useful_life",
      "net_book",
      "number_of_years_of_depreciation",
      "start_date_of_the_fiscal_year",
      "value_of_the_asset",
      "year",
      "created_at",
    ]
  );

  const { data, error } = await supabase
    .from("Amortization")
    .select(query)
    .eq("department_id", department_id)
    .order("created_at", { ascending: false })
    .range(count * page, page * count + count - 1);

  if (error) {
    console.log("error: ", error);
    return;
  }
  const amortization = data.map((amortization: any) => {
    return {
      id: amortization.uid,
      uid: amortization.uid,
      accumulated_depreciation: amortization.accumulated_depreciation,
      acquisition_date: amortization.acquisition_date,
      book_value: amortization.book_value,
      depreciation_installment: amortization.depreciation_installment,
      first_year_useful_life: amortization.first_year_useful_life,
      last_year_useful_life: amortization.last_year_useful_life,
      net_book: amortization.net_book,
      number_of_years_of_depreciation:
        amortization.number_of_years_of_depreciation,
      start_date_of_the_fiscal_year: amortization.start_date_of_the_fiscal_year,
      value_of_the_asset: amortization.value_of_the_asset,
      year: amortization.year,
      created_at: amortization.created_at,
      department_id: department_id,
    };
  });
  return amortization;
}

async function fetchTotalAmortizationCount(department_id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Amortization")
    .select("uid")
    .eq("department_id", department_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data.length;
}

export interface AmortizationPayload {
  department_id: string;
  accumulated_depreciation: number | null;
  acquisition_date: string | null;
  book_value: number | null;
  depreciation_installment: number | null;
  first_year_useful_life: number | null;
  last_year_useful_life: number | null;
  net_book: number | null;
  number_of_years_of_depreciation: number | null;
  start_date_of_the_fiscal_year: string | null;
  value_of_the_asset: number | null;
  year: number | null;
}

async function createAmortization(AmortizationPayload: AmortizationPayload) {
  const supabase = createClient();
  const { data, error } = await supabase.from("Amortization").insert({
    department_id: AmortizationPayload.department_id,
    accumulated_depreciation: AmortizationPayload.accumulated_depreciation,
    acquisition_date: AmortizationPayload.acquisition_date,
    book_value: AmortizationPayload.book_value,
    depreciation_installment: AmortizationPayload.depreciation_installment,
    first_year_useful_life: AmortizationPayload.first_year_useful_life,
    last_year_useful_life: AmortizationPayload.last_year_useful_life,
    net_book: AmortizationPayload.net_book,
    number_of_years_of_depreciation:
      AmortizationPayload.number_of_years_of_depreciation,
    start_date_of_the_fiscal_year:
      AmortizationPayload.start_date_of_the_fiscal_year,
    value_of_the_asset: AmortizationPayload.value_of_the_asset,
    year: AmortizationPayload.year,
  });
  if (error) {
    throw error;
  }
  return data;
}

async function updateAmortization(
  amortizationPayload: AmortizationPayload,
  Id: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Amortization")
    .update({ ...amortizationPayload })
    .eq("uid", Id);
  if (error) {
    toast.error("Amortization Error", {
      position: "bottom-right",
    });
    throw error;
  }
  toast.success("Amortization Edited successfully", {
    position: "bottom-right",
  });
  return data;
}

export {
  fetchTotalAmortizationCount,
  ClientFetchAmortizationLazy,
  createAmortization,
  updateAmortization,
};
