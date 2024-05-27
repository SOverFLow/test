export type Id = string;

export type Column = {
  uid: Id;
  title: string;
};

export type Task = {
  uid: string;
  title: string;
  cost: number;
  selling_price?: number;
  profit?: number;
  address: string;
  priority: string | null;
  column_id: string | null;
  column_title?: string;
  start_date: string;
  end_date: string;
  Workers: ({
    uid: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  } | null)[];
  Client: {
    uid: string;
    first_name: string;
    last_name: string;
  } | null;
  status: string;
  confirmed?: boolean;
};


export interface Status {
  uid: string;
  title: string;
}