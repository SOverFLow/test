import * as z from "zod";
export const studentSchema = z.object({
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
    address: z
    .string()
    .min(5, "address must be at least 5 characters")
    .max(150, "address must be at most 150 characters"),
    budget: z
    .string()
    .min(3, "budget must be at least 3 characters")
    .max(50, "budget must be at most 50 characters"),
    notes: z
    .string()
    .optional(),
    social_security_number: z
    .string()
    .optional(),
    date_of_birth: z.string().optional(),
    payment_method: z
    .string()
    .min(3, "payment method must be at least 3 characters")
    .max(50, "payment method must be at most 50 characters"),

});

export const EditStudentSchema = z.object({
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
    address: z
    .string()
    .min(5, "address must be at least 5 characters")
    .max(150, "address must be at most 150 characters"),
    budget: z
    .string()
    .min(3, "budget must be at least 3 characters")
    .max(50, "budget must be at most 50 characters"),
    notes: z
    .string()
    .optional(),
    social_security_number: z
    .string()
    .optional(),
    date_of_birth: z.string().optional(),
    payment_method: z
    .string()
    .min(3, "payment method must be at least 3 characters")
    .max(50, "payment method must be at most 50 characters"),
});

export type clientSchema = z.infer<typeof studentSchema>;
export type EditClientSchema = z.infer<typeof EditStudentSchema>;
