import * as z from "zod";

export const StatusSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title must be at most 50 characters"),
});

export type Status = z.infer<typeof StatusSchema>;
