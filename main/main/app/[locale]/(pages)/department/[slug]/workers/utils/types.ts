export type UserWorker = {
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  avatar: string | null;
  salary_hour: number;
  salary_day: number;
  task_cost_id: string | null;
  uid: string;
  updated_at: string;
  username: string;
  job_position: string | null;
  salary_month: number | null;
  salary_week: number | null;
  supervisor: string | null;
};

type SubObject = { [subKey: string]: boolean };
export type ObjectStructure = { [key: string]: SubObject };
