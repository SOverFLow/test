import * as z from "zod";

export const profileSchema = z.object({
  user_name: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .nullable()
    .optional(),
  first_name: z
    .string()
    .min(3, "first_name must be at least 3 characters")
    .max(50, "first_name must be at most 50 characters")
    .nullable()
    .optional(),
  last_name: z
    .string()
    .min(3, "last_name must be at least 3 characters")
    .max(50, "last_name must be at most 50 characters")
    .nullable()
    .optional(),
  phone: z
    .string()
    .min(3, "Phone number is too short")
    .max(50, "phone must be at most 50 characters")
    .nullable()
    .optional(),
});

export type profileSchema = z.infer<typeof profileSchema>;
