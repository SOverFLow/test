"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

//Redux / Supabase
import { setLang } from "@/store/langSlice";
import { setUser } from "@/store/userSlice";
import { createClient } from "@/utils/supabase/client";

export default function PagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = createClient();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLang(locale));
    supabase.auth
      .getUser()
      .then((user) => {
        dispatch(setUser(user?.data));
        console.log("user", user);
      })
      .catch((e) => {
        dispatch(setUser(null));
        console.log("errorin", e);
      });
  });
  return (
    <>
      {children}
    </>
  );
}
