import { useTranslations } from "next-intl";

const InputQuestions = () => {
  const t = useTranslations("QuestionnaireForm");
  return [
    {
      label: t("What-is-your-email?"),
      name: "email",
      type: "text",
      isRequired: true,
      componentType: "text",
      icon: "EmailIcon",
    },
    {
      label: t("What-is-your-favorite-hobby?"),
      name: "favorite",
      type: "text",
      isRequired: true,
      componentType: "text",
      icon: "FavoriteIcon",
    },
    {
      label: t("What-is-your-home-address?"),
      name: "address",
      type: "text",
      isRequired: true,
      componentType: "text",
      icon: "HomeIcon",
    },
    {
      label: t("What-is-your-highest-level-of-education?"),
      name: "education",
      type: "text",
      isRequired: true,
      componentType: "text",
      icon: "SchoolIcon",
    },
    {
      label: t("What-is-your-current-occupation?"),
      name: "occupation",
      type: "text",
      isRequired: true,
      componentType: "text",
      icon: "WorkIcon",
    },
  ];
};

export { InputQuestions };
