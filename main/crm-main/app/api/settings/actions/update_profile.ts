"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

type UserData = {
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  avatar: string | null;
  status: string;
  uid: string;
  updated_at: string;
};

const updateProfile = async (formData: UserData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;

  const { first_name, last_name, email, phone, avatar } = formData;
  let { data: table, error: tableError } = await supabase.rpc(
    "get_user_table",
    {
      user_uid: userId,
    }
  );
  if (tableError) {
    console.error(tableError);
    return { error: tableError.message };
  }
  console.log("table: ", table);
  const { data, error } = await supabase
    .from(table as "SuperAdmin" | "UserWorker" | "Client")
    .update({ first_name, last_name, email, phone, avatar })
    .eq("uid", userId);

  if (error) {
    console.error(error);
    return { error: error.message };
  } else {
    return { success: "your profile has been updated!" };
  }
};

export default updateProfile;

// create table
//   public."Client" (
//     uid uuid not null default gen_random_uuid (),
//     id bigint generated always as identity,
//     created_at timestamp with time zone not null default now(),
//     updated_at timestamp with time zone not null default now(),
//     status character varying null,
//     first_name character varying not null,
//     last_name character varying not null,
//     email character varying not null,
//     phone character varying not null,
//     avatar text null,
//     address text null,
//     city character varying null,
//     country character varying null,
//     date_of_birth text null,
//     gender character varying null,
//     state_province text null,
//     zip_code character varying null,
//     constraint Client_pkey primary key (uid),
//     constraint Client_email_key unique (email)
//   ) tablespace pg_default;

//   create table
//   public."UserWorker" (
//     uid uuid not null,
//     id bigint generated always as identity,
//     created_at timestamp with time zone not null default now(),
//     updated_at timestamp with time zone not null default now(),
//     first_name character varying not null,
//     last_name character varying not null,
//     email character varying not null,
//     phone character varying not null,
//     status character varying null,
//     task_cost_id uuid null,
//     avatar text null,
//     gender character varying not null default 'male'::character varying,
//     zip_code character varying null,
//     city character varying null,
//     state_province text null,
//     color character varying null,
//     salary_hour double precision not null default '0'::double precision,
//     salary_day double precision not null default '0'::double precision,
//     address text null,
//     country character varying null,
//     job_position character varying null,
//     hours_worked double precision null,
//     employment_date text null,
//     date_of_birth text null,
//     salary_month double precision null,
//     supervisor_id uuid null,
//     security_number text null,
//     licence_number text null,
//     notes text null,
//     constraint UserWorker_pkey primary key (uid),
//     constraint UserWorker_email_key unique (email),
//     constraint UserWorker_task_cost_id_fkey foreign key (task_cost_id) references "TaskCost" (uid),
//     constraint public_UserWorker_supervisor_id_fkey foreign key (supervisor_id) references "UserWorker" (uid)
//   ) tablespace pg_default;

//   create table
//   public."SuperAdmin" (
//     uid uuid not null default gen_random_uuid (),
//     id bigint generated always as identity,
//     created_at timestamp with time zone not null default now(),
//     updated_at timestamp with time zone not null default now(),
//     first_name character varying not null,
//     last_name character varying not null,
//     email character varying not null,
//     phone character varying not null,
//     status character varying not null,
//     avatar text null,
//     gender text null,
//     constraint SuperAdmin_pkey primary key (uid),
//     constraint SuperAdmin_email_key unique (email)
//   ) tablespace pg_default;

// create trigger on_create_superadmin_create_company
// after insert on "SuperAdmin" for each row
// execute function handle_new_company ();
