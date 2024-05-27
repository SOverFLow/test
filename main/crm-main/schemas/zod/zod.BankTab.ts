import { z } from "zod";
import { useTranslations } from "next-intl";

export const BankTabSchema = z.object({
  Label: z
    .string()
    .min(3, { message: "Label must be at least 3 characters long" })
    .max(20, { message: "Label must be at most 20 characters long" }),

  "Bank name": z.string().min(1, { message: "Bank name is Invalid!" }),
  Currency: z.string().min(1, { message: "Currency is Invalid!" }),
  Country: z.string().min(1, { message: "Country is Invalid!" }),
  "Account number": z
    .string()
    .min(1, { message: "Account number is Invalid!" }),
  "IBAN number": z.string().min(1, { message: "IBAN number is Invalid!" }),
  "BIC/SWIFT code": z
    .string()
    .min(1, { message: "BIC/SWIFT code is Invalid!" }),
  "Bank address": z.string().min(1, { message: "Bank address is Invalid!" }),
  "Account owner name": z
    .string()
    .min(1, { message: "Account owner name is Invalid!" }),
  "Account owner address": z
    .string()
    .min(1, { message: "Account owner address is Invalid!" }),
});

// Custom hook to create and return the BankTabSchema with dynamic translations
export function useBankTabSchema() {
  const t = useTranslations("Zod");

  const BankTabSchema = z.object({
    Label: z
      .string()
      .min(3, { message: t("label-must-be-at-least-3-characters-long") })
      .max(20, { message: t("label-must-be-at-most-20-characters-long") }),
    "Bank name": z.string().min(1, { message: t("bank-name-is-invalid") }),
    Currency: z.string().min(1, { message: t("currency-is-invalid") }),
    Country: z.string().min(1, { message: t("country-is-invalid") }),
    "Account number": z
      .string()
      .min(1, { message: t("account-number-is-invalid") }),
    "IBAN number": z.string().min(1, { message: t("iban-number-is-invalid") }),
    "BIC/SWIFT code": z
      .string()
      .min(1, { message: t("bic-swift-code-is-invalid") }),
    "Bank address": z
      .string()
      .min(1, { message: t("bank-address-is-invalid") }),
    "Account owner name": z
      .string()
      .min(1, { message: t("account-owner-name-is-invalid") }),
    "Account owner address": z
      .string()
      .min(1, { message: t("account-owner-address-is-invalid") }),
  });

  return BankTabSchema;
}
