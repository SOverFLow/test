import * as z from "zod";

export const tvaSchema = z.object({
  country: z
    .string()
    .max(50, "country must be at most 50 characters")
    .nullable(),
  value: z
    .number()
    .min(0, "value must be at least 0%")
    .max(100, "value must be at most 100%"),
  name: z
    .string()
    .min(2, "name must be at least 2 characters")
    .max(50, "name must be at most 50 characters"),
  description: z
    .string()
    .max(100, "description must be at most 100 characters")
    .nullable(),
});

export type tvaSchema = z.infer<typeof tvaSchema>;
