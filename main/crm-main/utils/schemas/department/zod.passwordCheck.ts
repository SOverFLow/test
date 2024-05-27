'use client';
import { useTranslations } from "next-intl";
import * as z from "zod";

export function usePasswordCheck() {
  const t = useTranslations("navbardeper");
  return z.object({
  password: z.string().min(3, t('password-must-be-at-least-3-characters')).max(50, t('password-must-be-at-most-50-characters')),
});
}