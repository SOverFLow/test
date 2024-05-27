"use client";

import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import DepartmentCard from "./TvaCard";
import { createClient } from "@/utils/supabase/client";

export default function ListTva({
  tvaList,
  department_id,
}: {
  tvaList: any[];
  department_id: string;
}) {
  const supabase = createClient();
  const [tva, setTva] = useState(tvaList);

  useEffect(() => {
    const tvaChanel = supabase
      .channel("tvaChanel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "TVA",
          filter: "department_id=eq." + department_id,
        },
        (payload) => {
          console.log("payload: ", payload);
          supabase
            .from("TVA")
            .select("uid, country, description, name, department_id, value")
            .eq("department_id", department_id)
            .then(({ data, error }) => {
              if (error) {
                console.log("error: ", error);
                return;
              }
              setTva(data);
            });
        }
      )
      .subscribe();
    return () => {
      tvaChanel.unsubscribe();
    };
  });

  return (
    <Grid container spacing={2} mt={1}>
      {tva &&
        tva.map((tva, index) => (
          <Grid item xs={12} md={4} lg={3} xl={2} key={index}>
            <DepartmentCard {...tva} />
          </Grid>
        ))}
    </Grid>
  );
}
