import { useTranslations } from "next-intl";
import { z } from "zod";

export const PasswordChangeCardSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Minimum 8 characters required" }),
    confirmNewPassword: z
      .string()
      .min(8, { message: "Minimum 8 characters required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export function useZodPasswordChangeCardSchema() {
  const t = useTranslations("Zod");

  const PasswordChangeCardSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: t("password-is-required") }),
      newPassword: z
        .string()
        .min(8, { message: t("minimum-8-characters-required") }),
      confirmNewPassword: z
        .string()
        .min(8, { message: t("minimum-8-characters-required") }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwords-dont-match"),
      path: ["confirm"],
    });

  return PasswordChangeCardSchema;
}
