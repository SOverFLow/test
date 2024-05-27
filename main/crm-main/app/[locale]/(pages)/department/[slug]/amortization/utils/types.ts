export type Amortization = {
  accumulated_depreciation: number | null;
  acquisition_date: string | null;
  book_value: number | null;
  created_at: string;
  department_id: string | null;
  depreciation_installment: number | null;
  first_year_useful_life: number | null;
  last_year_useful_life: number | null;
  net_book: number | null;
  number_of_years_of_depreciation: number | null;
  start_date_of_the_fiscal_year: string | null;
  uid: string;
  value_of_the_asset: number | null;
  year: number | null;
};
