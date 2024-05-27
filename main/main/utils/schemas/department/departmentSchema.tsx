'use client';
import { useTranslations } from "next-intl";
import * as z from "zod";

export function useDepartSchema() {
  const t = useTranslations("navbardeper");
  return z.object({
    title: z.string().min(3, t('title-must-be-at-least-3-characters')).max(50, t('title-must-be-at-most-50-characters')),
    description: z.string().nullable(),
  });
}
