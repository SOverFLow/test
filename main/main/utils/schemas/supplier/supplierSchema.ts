import * as z from "zod";

export const SupplierSchema = z.object({
  name: z
    .string()
    .min(3, "name must be at least 3 characters long")
    .max(50, "name cannot exceed 20 characters"),
  email: z.string().email("invalid email"),
  phone_number: z
    .string()
    .min(10, "Phone number is too short")
    .max(14, "phone must be at most 14 characters"),
  zip_code: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  cuurency: z.string().optional(),
  supplier_type: z.string().optional(),
  profesional_id: z.string().optional(),
});

export type SupplierSchema = z.infer<typeof SupplierSchema>;
