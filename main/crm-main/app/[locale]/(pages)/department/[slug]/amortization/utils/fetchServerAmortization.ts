import { getDbOnSever } from "@/utils/supabase/cookie";
import { Amortization } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerAmortization(
  department_id: string
): Promise<Amortization[] | undefined> {
  const supabase = await getDbOnSever();
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
    .limit(25);

  if (error) {
    console.log("error: ", error);
    return;
  }
  const amortizations = data.map((amortization: any) => {
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
  return amortizations;
}
export default fetchServerAmortization;
