import * as z from "zod";

export const bienSchema = z.object({
  name: z
    .string()
    .min(3, "name must be at least 3 characters long")
    .max(30, "name cannot exceed 30 characters"),
  type: z
    .string()
    .min(3, "type must be at least 3 characters")
    .max(50, "type must be at most 50 characters"),
  description: z
    .string()
    .min(1, "description required")
    .max(500, "description must be at most 500 characters")
    .nullable(),
  location: z
    .string()
    .min(1, "location required")
    .max(500, "location must be at most 500 characters")
    .nullable(),
  zip_code: z
    .string()
    .max(30, "zip code must be at most 10 characters")
    .min(1, "state province required"),
  city: z
    .string()
    .max(50, "city must be at most 50 characters")
    .min(1, "city required"),
  state_province: z
    .string()
    .max(50, "state province must be at most 50 characters")
    .min(1, "state province required"),
  country: z
    .string()
    .max(50, "country must be at most 50 characters")
    .min(1, "country required"),
  phone: z
    .string()
    .max(30, "Invalid phone number")
    .min(8, "Invalid phone number"),
  status: z.string().min(1, "status required"),
  client: z.object({
    uid: z.string().min(1, "client required"),
    name: z.string().min(1, "client required"),
  }),
  //   .optional(),
});

export type bienSchema = z.infer<typeof bienSchema>;
