'use client';
import { useTranslations } from "next-intl";
import * as z from "zod";

const isDateOlderThanFourteenYears = (value: string | undefined) => {
  if (!value) return true; // If date is not provided, it's considered valid
  const dateOfBirth = new Date(value);
  const currentDate = new Date();
  const yearsDiff = currentDate.getFullYear() - dateOfBirth.getFullYear();
  const isOlderThanFourteen = yearsDiff > 14 || (yearsDiff === 14 && currentDate.getMonth() > dateOfBirth.getMonth());
  return isOlderThanFourteen;
};

export function useCreateWorker() {
	const t = useTranslations("worker");
  return z.object({
  first_name: z
    .string()
    .min(3, t('first_name-must-be-at-least-3-characters'))
    .max(50, t('first_name-must-be-at-most-50-characters')),
  last_name: z
    .string()
    .min(3, t('last_name-must-be-at-least-3-characters'))
    .max(50, t('last_name-must-be-at-most-50-characters')),
  email: z.string().email(t('invalid-email')),
  phone: z
    .string()
    .min(8, t('phone-number-is-too-short'))
    .max(50, t('phone-must-be-at-most-50-characters')),

  password: z
    .string()
    .min(8, t('password-must-be-at-least-8-characters'))
    .max(50, t('password-must-be-at-most-50-characters')),

  salary_hour: z
    .number()
    .min(11, t('salary_hour-must-be-at-least-11-euro'))
    .max(10000000, t('salary_hour-must-be-at-most-10000000-euro')),
  salary_day: z
    .number()
    .min(11, t('salary_day-must-be-at-least-11-euro'))
    .max(10000000, t('salary_day-must-be-at-most-10000000-euro')),
    salary_month: z
    .number()
    .min(11, t('salary_month-must-be-at-least-11-euro')),
  date_of_birth: z.string().optional().refine(isDateOlderThanFourteenYears, {
      message: t('date-of-birth-must-be-older-than-14-years'),
    }),

  gender: z.string().optional(),
  zip_code: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  job_position: z.string().optional(),
  employment_date: z.string().optional(),
  security_number: z.string().optional(),
  licence_number: z.string().optional(),
  notes: z.string().optional(),
});
}

export function useEditWorker() {
  const t = useTranslations("worker");
  return z.object({
  first_name: z
    .string()
    .min(3, t('first_name-must-be-at-least-3-characters'))
    .max(50, t('first_name-must-be-at-most-50-characters')),
  last_name: z
    .string()
    .min(3, t('last_name-must-be-at-least-3-characters'))
    .max(50, t('last_name-must-be-at-most-50-characters')),
  email: z.string().email(t('invalid-email')),
  phone: z
    .string()
    .min(8, t('phone-number-is-too-short'))
    .max(50, t('phone-must-be-at-most-50-characters')),

  salary_hour: z
    .number()
    .min(11, t('salary_hour-must-be-at-least-11-euro'))
    .max(10000000, t('salary_hour-must-be-at-most-10000000-euro')),
  salary_day: z
    .number()
    .min(11, t('salary_day-must-be-at-least-11-euro'))
    .max(10000000, t('salary_day-must-be-at-most-10000000-euro')),
    salary_month: z
    .number()
    .min(11, t('salary_month-must-be-at-least-11-euro')),

  gender: z.string().optional(),
  zip_code: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  job_position: z.string().optional(),
  employment_date: z.string().optional(),
  date_of_birth: z.string().optional(),
  security_number: z.string().optional(),
  licence_number: z.string().optional(),
  notes: z.string().optional(),
})
}

