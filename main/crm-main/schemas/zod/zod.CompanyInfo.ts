import { useTranslations } from "next-intl";
import { z } from "zod";

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CompanyInfoSchema = z.object({
  companyLogo: z
    .any()
    .optional()
    .nullable()
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max image size is 50MB.`
    ),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" })
    .optional()
    .nullable(),
  email: z
    .string()
    .email({ message: "Email is Invalid!" })
    .optional()
    .nullable(),
  phone: z
    .string()
    .min(8, { message: "Invalid phone number" })
    .max(20, { message: "Invalid phone number" })
    .optional()
    .nullable(),
  address: z
    .string()
    .min(1, { message: "adress is Invalid!" })
    .optional()
    .nullable(),

  website: z
    .string()
    .url({ message: "website url is Invalid!" })
    .optional()
    .nullable(),
  note: z
    .string()
    .min(1, { message: "note is Invalid!" })
    .max(200, { message: "Maximum 200 characters" })
    .optional()
    .nullable(),
  siret: z
    .string()
    .min(1, { message: "note is Invalid!" })
    .optional()
    .nullable(),
  capital: z
    .string()
    .min(1, { message: "note is Invalid!" })
    .optional()
    .nullable(),
  conditions_bank: z
    .string()
    .min(1, { message: "note is Invalid!" })
    .optional()
    .nullable(),
});

export function useZodCompanyInfoSchema() {
  const t = useTranslations("Zod");

  const CompanyInfoSchema = z.object({
    companyLogo: z
      .any()
      .optional()
      .nullable()
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        `Max image size is 50MB.`
      ),
    name: z
      .string()
      .min(3, { message: t("name-must-be-at-least-3-characters-long") })
      .max(20, { message: t("name-must-be-at-most-20-characters-long") })
      .optional()
      .nullable(),
    email: z
      .string()
      .email({ message: t("email-is-invalid") })
      .optional()
      .nullable(),
    phone: z
      .string()
      .min(8, { message: t("invalid-phone-number") })
      .max(20, { message: t("invalid-phone-number") })
      .optional()
      .nullable(),
    address: z
      .string()
      .min(1, { message: t("adress-is-invalid") })
      .optional()
      .nullable(),

    website: z
      .string()
      .url({ message: t("website-url-is-invalid") })
      .optional()
      .nullable(),
    note: z
      .string()
      .min(1, { message: t("note-is-invalid") })
      .max(200, { message: t("maximum-200-characters") })
      .optional()
      .nullable(),
  });

  return CompanyInfoSchema;
}
