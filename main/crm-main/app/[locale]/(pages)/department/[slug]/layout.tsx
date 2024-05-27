"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDepartment, setDepartmentUid } from "@/store/departmentSlice";
import { createClient } from "@/utils/supabase/client";

export default function DepartmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const dispatch = useDispatch();
  const supabase = createClient();
  useEffect(() => {
    const fetchDepartment = async () => {
      const { data, error } = await supabase
        .from("Department")
        .select("*")
        .eq("uid", params.slug);
      if (error) {
        console.error("Error fetching Department", error);
        return;
      }
      dispatch(setDepartment({uid: data[0].uid, name: data[0].title, description: data[0].description}));
      dispatch(setDepartmentUid(params.slug));
    }
    fetchDepartment();
    return () => {
      dispatch(setDepartment({uid: "", name: "", description: ""}));
      dispatch(setDepartmentUid(""));
    };
  });

  return <>{children}</>;
}
