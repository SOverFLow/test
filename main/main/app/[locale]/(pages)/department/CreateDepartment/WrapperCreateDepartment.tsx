import { useTranslations } from "next-intl";
import CreateDepartment from "./CreateDepartment";

export default function WrapperCreateDepartment({
  dialogOpen,
  setDialogOpen,
  fromMenu = 0,
}: {
  dialogOpen?: any;
  setDialogOpen?: any;
  fromMenu?: number;
}) {
  const t = useTranslations("AddDepartmentForm");
  const translateObject = {
    Formtitle: t("Formtitle"),
    title: t("title"),
    description: t("description"),
    add_button: t("add_button"),
    cancel_button: t("cancel_button"),
    dialogOpen: dialogOpen,
    setDialogOpen: setDialogOpen,
    fromMenu: fromMenu,
  };
  return <CreateDepartment tranlateObj={translateObject} />;
}
