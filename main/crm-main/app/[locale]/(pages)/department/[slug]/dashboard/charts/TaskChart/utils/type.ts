export type Task = {
  uid: string;
  title: string;
  start_date: string;
  end_date: string;
  Workers: ({
    uid: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  } | null)[];
};
