"use client";
import { useTranslations } from "next-intl";
import * as z from "zod";

export function useQuestionnaireCheck() {
  const t = useTranslations("QuestionnaireForm");
  return z.object({
    email: z.string().email(t("invalid-email")),
    favorite: z
      .string()
      .min(2, t("favorite-is-too-short"))
      .max(150, t("favorite-must-be-at-most-150-characters")),
    address: z
      .string()
      .min(2, t("address-is-too-short"))
      .max(150, t("address-must-be-at-most-150-characters")),
    education: z
      .string()
      .min(2, t("education-is-too-short"))
      .max(150, t("education-must-be-at-most-150-characters")),
    occupation: z
      .string()
      .min(2, t("occupation-is-too-short"))
      .max(150, t("occupation-must-be-at-most-150-characters")),
  });
}
