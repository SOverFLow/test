interface FormInput {
    label: string;
    name: string;
    type?: string;
  }

export const inputDataAmortization: FormInput[] = [
    {
      label: "Accumulated Depreciation",
      name: "accumulated_depreciation",
      type: "number",
    },
    { label: "Book Value", name: "book_value", type: "number" },
    {
      label: "Depreciation Installment",
      name: "depreciation_installment",
      type: "number",
    },
    {
      label: "First Year Useful Life",
      name: "first_year_useful_life",
      type: "number",
    },
    {
      label: "Last Year Useful Life",
      name: "last_year_useful_life",
      type: "number",
    },
    { label: "Net Book", name: "net_book", type: "number" },
    {
      label: "Number of Years of Depreciation",
      name: "number_of_years_of_depreciation",
      type: "number",
    },
    { label: "Value of the Asset", name: "value_of_the_asset", type: "number" },
    { label: "Year", name: "year", type: "number" },
    { label: "Acquisition Date", name: "acquisition_date", type: "date" },
    {
      label: "Start Date of the Fiscal Year",
      name: "start_date_of_the_fiscal_year",
      type: "date",
    },
  ];