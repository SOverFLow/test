"use client";
import { useTranslations } from "next-intl";

const InputDataStudent = () => {
  const t = useTranslations("student");
  return [
    {
      label: t("first-name"),
      name: "first_name",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("last-name"),
      name: "last_name",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: "email",
      name: "email",
      type: "email",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("address"),
      name: "address",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("date_of_birth"),
      name: "date_of_birth",
      type: "date",
      fieldsPerRow: 1,
      isRequired: false,
      componentType: "text",
    },
    {
      label: t("phone"),
      name: "phone",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "phoneInput",
    },
    {
      label: t("password"),
      name: "password",
      type: "password",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "password",
    },
    {
      label: t("budget"),
      name: "budget",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "select",
      selects: ["OPEO", "CPF", "IND"],
    },
    {
      label: t("payment_method"),
      name: "payment_method",
      type: "text",
      fieldsPerRow: 1,
      isRequired: false,
      componentType: "select",
      selects: ["OPEO", "CPF", "IND", "STRIPE", "CASH", "OTHER"],
    },
    {
      label: t("Social-Security-Number"),
      name: "social_security_number",
      type: "text",
      fieldsPerRow: 2,
      isRequired: false,
      componentType: "text",
    },
    {
      label: t("notes"),
      name: "notes",
      type: "text",
      fieldsPerRow: 2,
      isRequired: false,
      componentType: "textarea",
    },
  ];
};

const InputDataStudentEdit = () => {
  const t = useTranslations("student");
  return [
    {
      label: t("first-name"),
      name: "first_name",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("last-name"),
      name: "last_name",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: "email",
      name: "email",
      type: "email",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("address"),
      name: "address",
      type: "text",
      fieldsPerRow: 2,
      isRequired: true,
      componentType: "text",
    },
    {
      label: t("phone"),
      name: "phone",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "phoneInput",
    },
    {
      label: t("budget"),
      name: "budget",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "select",
      selects: ["OPEO", "CPF", "IND"],
    },
    {
      label: t("payment_method"),
      name: "payment_method",
      type: "text",
      fieldsPerRow: 1,
      isRequired: false,
      componentType: "select",
      selects: ["OPEO", "CPF", "IND", "STRIPE", "CASH", "OTHER"],
    },
    {
      label: t("Social-Security-Number"),
      name: "social_security_number",
      type: "text",
      fieldsPerRow: 2,
      isRequired: false,
      componentType: "text",
    },
    {
      label: t("notes"),
      name: "notes",
      type: "text",
      fieldsPerRow: 2,
      isRequired: false,
      componentType: "textaera",
    },
  ];
};

//address required  cncc setting for budget and payment method and level in the setting of the company

export default InputDataStudent;
export { InputDataStudentEdit };
