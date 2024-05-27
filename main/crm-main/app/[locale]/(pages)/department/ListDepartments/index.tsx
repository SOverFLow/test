"use client";

import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import DepartmentCard from "./DepartmentCard";
import type DepartmentType from "../utils/department.types";
import { createClient } from "@/utils/supabase/client";

export default function ListDepartments({
  departmentList,
}: {
  departmentList: DepartmentType[];
}) {
  const supabase = createClient();
  const [departments, setDepartments] = useState(departmentList);

  useEffect(() => {
    supabase
      .channel("departments changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Department" },
        (payload) => {
          // update the departments when a change is detected
          console.log("department changed", payload);
          // ! still need optimizations
          supabase
            .from("Department")
            .select("uid, created_at, title, description")
            .then(({ data, error }) => {
              if (error) {
                console.log("error: ", error);
                return;
              }
              setDepartments(data);
            });
        }
      )
      .subscribe();
  }, [supabase]);

  return (
    <Grid container spacing={3} mt={1}>
      {departments &&
        departments.map((department, index) => (
          <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
            <DepartmentCard {...department} />
          </Grid>
        ))}
    </Grid>
  );
}
