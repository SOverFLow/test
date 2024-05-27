import * as z from "zod";

export const CatalogSchema = z.object({
    name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(50, "name must be at most 50 characters"),
    reference: z.string().min(3, "reference must be at least 3 characters")
    .max(50, "reference must be at most 50 characters"),
    weight: z.number().optional(),
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    area: z.number().optional(),
    volume: z.number().optional(),
    country_of_origin: z.string().optional(),
    state_province_of_origin: z.string().optional(),
    nature_of_product: z.string().optional(),
});

export type CatalogSchema = z.infer<typeof CatalogSchema>;