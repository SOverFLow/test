import { Amortization } from "./types";

export function payloadToupdateAmortization(amortization: any): Amortization {
  return {
    uid: amortization.uid,
    accumulated_depreciation: amortization.accumulated_depreciation,
    acquisition_date: amortization.acquisition_date,
    book_value: amortization.book_value,
    created_at: amortization.created_at,
    department_id: amortization.department_id,
    depreciation_installment: amortization.depreciation_installment,
    first_year_useful_life: amortization.first_year_useful_life,
    last_year_useful_life: amortization.last_year_useful_life,
    net_book: amortization.net_book,
    number_of_years_of_depreciation:
      amortization.number_of_years_of_depreciation,
    start_date_of_the_fiscal_year: amortization.start_date_of_the_fiscal_year,
    value_of_the_asset: amortization.value_of_the_asset,
    year: amortization.year,
  };
}

export function payloadToAmortizationData(amortization: any) {
  return {
    id: amortization.uid,
    col1: amortization.accumulated_depreciation || "No",
    col2: amortization.acquisition_date || "No",
    col3: amortization.book_value || "No",
    col4: amortization.depreciation_installment || "No",
    col5: amortization.first_year_useful_life || "No",
    col6: amortization.last_year_useful_life || "No",
    col7: amortization.net_book || "No",
    col8: amortization.number_of_years_of_depreciation || "No",
    col9: amortization.start_date_of_the_fiscal_year || "No",
    col10: amortization.value_of_the_asset || "No",
    col11: amortization.year || "No",
    col12: amortization,
  };
}
