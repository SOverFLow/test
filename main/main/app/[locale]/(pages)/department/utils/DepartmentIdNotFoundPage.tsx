"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

function DepartmentIdNotFoundPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("departmentNotFound");
  const t = useTranslations("departmentMenu");

  useEffect(() => {
    if (search === "true") {
      toast.error(t("department-id-not-found"), {
        position: "bottom-right",
      });
    }
  }, [t, search]);

  return <></>;
}

export default DepartmentIdNotFoundPage;
