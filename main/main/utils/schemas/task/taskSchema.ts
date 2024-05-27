import * as z from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "* Title must be at least 3 characters")
    .max(50, "* Title must be at most 50 characters"),
  description: z
    .string()
    .max(500, "description must be at most 500 characters")
    .nullable(),
  address: z
    .string()
    .min(3, "* address must be at least 3 characters")
    .max(500, "* address must be at most 500 characters"),
  client_id: z.string().min(3, "* client must be not empty"),
  status: z.string().min(1, "* status must be not empty"),
  priority: z.string().min(3, "* priority must be not empty"),
  start_date: z.date(),
  end_date: z.date(),
  start_hour: z.number().min(1, "* Required field"),
  end_hour: z.number().min(1, "* Required field"),
  task_type: z.string().min(3, "* task type must be not empty"),
  // workers: z.array(z.any()).min(1, "* worker must be not empty"),
});

export const taskSchemaFirstStep = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .max(500, "* Description must be at most 500 characters")
    .nullable(),
  start_date: z.date(),
  end_date: z.date(),
  task_type: z.string().min(3, "* Task type must be not empty"),
  start_hour: z.date(),
  end_hour: z.date(),
});

export const taskSchemaSecondStep = z.object({
  address: z
    .string()
    .min(3, "* address must be at least 3 cha5465racters")
    .max(500, "* address must be at most 500 characters"),
});


export const taskProductsSchema = z.object({

  // products: z
  // .string()
  //   .max(500, "description must be at most 500 characters")
  //   .nullable(),


});


export type TaskSchema = z.infer<typeof taskSchema>;
export type taskSchemaFirstStep = z.infer<typeof taskSchemaFirstStep>;
export type taskSchemaSecondStep = z.infer<typeof taskSchemaSecondStep>;
export type taskProductsSchema = z.infer<typeof taskProductsSchema>;
