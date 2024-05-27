import { useTranslations } from "next-intl";
import { z } from "zod";

// export const AccountantTabSchema = z.object({
//   Name: z
//     .string()
//     .min(3, { message: "Name must be at least 3 characters long" })
//     .max(20, { message: "Name must be at most 20 characters long" })
//     .optional()
//     .nullable(),
//   EMail: z
//     .string()
//     .email({ message: "Email is Invalid!" })
//     .optional()
//     .nullable(),
//   Zip: z.string().min(1, { message: "Zip is Invalid!" }).optional().nullable(),
//   Town: z
//     .string()
//     .min(1, { message: "Town is Invalid!" })
//     .optional()
//     .nullable(),
//   Country: z
//     .string()
//     .min(1, { message: "Country is Invalid!" })
//     .optional()
//     .nullable(),
//   Web: z
//     .string()
//     .url({ message: "website url is Invalid!" })
//     .optional()
//     .nullable(),

//   Phone: z
//     .string()
//     .min(8, { message: "Invalid phone number" })
//     .max(20, { message: "Invalid phone number" })
//     .optional()
//     .nullable(),
//   Address: z
//     .string()
//     .min(1, { message: "adress is Invalid!" })
//     .optional()
//     .nullable(),

//   Note: z
//     .string()
//     .min(1, { message: "note is Invalid!" })
//     .max(200, { message: "Maximum 200 characters" })
//     .optional()
//     .nullable(),
//   "Accountant code": z
//     .string()
//     .min(1, { message: "note is Invalid!" })
//     .max(200, { message: "Maximum 200 characters" })
//     .optional()
//     .nullable(),
// });

// Custom hook to create and return the BankTabSchema with dynamic translations
export function useZodAccountantTabSchema() {
  const t = useTranslations("Zod");

  const AccountantTabSchema = z.object({
    Name: z
      .string()
      .min(3, { message: t("name-must-be-at-least-3-characters-long") })
      .max(20, { message: t("name-must-be-at-most-20-characters-long") })
      .optional()
      .nullable(),
    EMail: z
      .string()
      .email({ message: t("email-is-invalid") })
      .optional()
      .nullable(),
    Zip: z
      .string()
      .min(1, { message: t("zip-is-invalid") })
      .optional()
      .nullable(),
    Town: z
      .string()
      .min(1, { message: t("town-is-invalid") })
      .optional()
      .nullable(),
    Country: z
      .string()
      .min(1, { message: t("country-is-invalid") })
      .optional()
      .nullable(),
    Web: z
      .string()
      .url({ message: t("website-url-is-invalid") })
      .optional()
      .nullable(),

    Phone: z
      .string()
      .min(8, { message: t("invalid-phone-number") })
      .max(20, { message: t("invalid-phone-number") })
      .optional()
      .nullable(),
    Address: z
      .string()
      .min(1, { message: t("adress-is-invalid") })
      .optional()
      .nullable(),

    Note: z
      .string()
      .min(1, { message: t("note-is-invalid") })
      .max(200, { message: t("maximum-200-characters") })
      .optional()
      .nullable(),
    "Accountant code": z
      .string()
      .min(1, { message: t("note-is-invalid") })
      .max(200, { message: t("maximum-200-characters") })
      .optional()
      .nullable(),
  });

  return AccountantTabSchema;
}
