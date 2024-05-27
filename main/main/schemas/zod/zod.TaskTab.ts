import { useTranslations } from "next-intl";
import { z } from "zod";
// export const TaskTabSchema = z.object({
//   "working hours": z
//     .number()
//     .gt(0, "working hourse should be greater than 0")

//     .optional()
//     .nullable(),
//   "min minutes for task": z
//     .number()
//     .gt(0, "min minutes for task should be greater than 0")
//     .optional()
//     .nullable(),
// });

export function useZodTaskTabSchema() {
  const t = useTranslations("Zod");

  const TaskTabSchema = z.object({
    "working hours": z
      .number()
      .gt(0, t("working-hourse-should-be-greater-than-0"))

      .optional()
      .nullable(),
    "min minutes for task": z
      .number()
      .gt(0, t("min-minutes-for-task-should-be-greater-than-0"))
      .optional()
      .nullable(),
  });

  return TaskTabSchema;
}
