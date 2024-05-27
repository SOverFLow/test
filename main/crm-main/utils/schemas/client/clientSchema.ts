import * as z from "zod";
export const clientSchema = z.object({
  first_name: z
    .string()
    .min(3, "first_name must be at least 3 characters")
    .max(50, "first_name must be at most 50 characters"),
  last_name: z
    .string()
    .min(3, "last_name must be at least 3 characters")
    .max(50, "last_name must be at most 50 characters"),
  email: z.string().email("invalid email"),
  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(50, "phone must be at most 50 characters"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(50, "password must be at most 50 characters"),
  // bien_id: z.string().min(10, "Select a bien for the client").optional(),
});

export const EditClientSchema = z.object({
  first_name: z
    .string()
    .min(3, "first_name must be at least 3 characters")
    .max(50, "first_name must be at most 50 characters"),
  last_name: z
    .string()
    .min(3, "last_name must be at least 3 characters")
    .max(50, "last_name must be at most 50 characters"),
  email: z.string().email("invalid email"),
  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(50, "phone must be at most 50 characters"),
  // bien_id: z.string().min(10, "Select a bien for the client"),
});

export type clientSchema = z.infer<typeof clientSchema>;
export type EditClientSchema = z.infer<typeof EditClientSchema>;
