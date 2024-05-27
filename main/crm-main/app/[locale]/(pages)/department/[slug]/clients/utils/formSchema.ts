"use client";
import { useTranslations } from "next-intl";

const InputDataClient = () => {
  const t = useTranslations("client");
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
      label: t("bien"),
      name: "bien_id",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "select",
    },
  ];
};

const InputDataClientEdit = () => {
  const t = useTranslations("client");
  return [
    {
      label: "email",
      name: "email",
      type: "email",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "text",
    },
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
      label: t("phone"),
      name: "phone",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "phoneInput",
    },
    {
      label: t("bien"),
      name: "bien_id",
      type: "text",
      fieldsPerRow: 1,
      isRequired: true,
      componentType: "select",
    },
  ];
};

export default InputDataClient;
export { InputDataClientEdit };
