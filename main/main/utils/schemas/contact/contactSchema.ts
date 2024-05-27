import * as z from "zod";
export const contactSchema = z.object({
  full_name: z
    .string()
    .min(3, "full_name must be at least 3 characters")
    .max(50, "full_name must be at most 50 characters"),
  email: z.string().email("invalid email"),
  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(50, "phone must be at most 50 characters"),
  address: z
    .string()
    .min(8, "address must be at least 8 characters")
    .max(100, "address must be at most 50 characters"),
});

export const EditContactSchema = z.object({
  full_name: z
    .string()
    .min(3, "full_name must be at least 3 characters")
    .max(50, "full_name must be at most 50 characters"),
  email: z.string().email("invalid email"),
  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(50, "phone must be at most 50 characters"),
  address: z
    .string()
    .min(8, "address must be at least 8 characters")
    .max(100, "address must be at most 50 characters"),
  status: z
    .string()
    .min(3, "status must be at least 3 characters")
    .max(30, "status must be at most 30 characters"),
});

export type contactSchema = z.infer<typeof contactSchema>;
export type EditContactSchema = z.infer<typeof EditContactSchema>;