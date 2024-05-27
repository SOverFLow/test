import * as z from "zod";
export const amortizationSchema = z.object({
  
    accumulated_depreciation: z.number().optional(),
    acquisition_date: z.string().optional(),
    book_value: z.number().optional(),
    depreciation_installment: z.number().optional(),
    first_year_useful_life: z.number().optional(),
    last_year_useful_life: z.number().optional(),
    net_book: z.number().optional(),
    number_of_years_of_depreciation: z.number().optional(),
    start_date_of_the_fiscal_year: z.string().optional(),
    value_of_the_asset: z.number().optional(),
    year: z.number().optional(),
});

export type amortizationSchema = z.infer<typeof amortizationSchema>;
