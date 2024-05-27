"use client";
import { CircularProgress } from "@mui/material";
import { checkUserIfExist } from "./utils/fetch";
import { getRoleOfWorker } from "../../workers/EditRole/fetchData";
import { useEffect, useState, useTransition } from "react";
import VerticalTabs from "./components/VerticalTabs";

export default function Setting({
  params,
}: {
  params: { locale: string; slug: string; id: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [isUser, setUser] = useState<boolean>(false);
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    startTransition(async () => {
      const { data, error } = await checkUserIfExist(params.id);
      const roleOfWorker = await getRoleOfWorker(params.id as string);
      setUserRole(roleOfWorker as string);

      if (data) setUser(data as boolean);
      if (error) console.error("Error fetching user", error);
    });
  }, [params.id]);

  return (
    <>
      {!isPending && isUser ? (
        <VerticalTabs
          userId={params.id}
          userRole={userRole}
          slug={params.slug}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
