import * as z from "zod";

export const stockSchema = z.object({
  // owner: z
  //   .string()
  //   .min(3, "owner must be at least 3 characters")
  //   .max(50, "owner must be at most 50 characters")
  //   .nullable(),
  // quantity: z
  //   .number()
  //   .min(1, "quantity must be at least 1 ")
  //   .max(10000000, "owner must be at most 10000000"),
  location: z
    .string()
    .min(2, "location must be at least 2 characters")
    .max(100, "location must be at most 100 characters")
    .nullable(),
  expiry_date: z.date(),
  payment_method: z
    .string()
    .min(2, "payment method type must be selected")
    .max(50, "payment method must be at most 50 characters")
    .nullable(),
  purchase_date: z.date(),
  products: z.string().min(2, "Select One or more products at least"),
  name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(50, "name must be at most 50 characters"),
  type: z
    .string()
    .min(1, "stock type must be selected")
    .max(50, "stock type must be at most 50 characters")
    .nullable(),
});

export type stockSchema = z.infer<typeof stockSchema>;
