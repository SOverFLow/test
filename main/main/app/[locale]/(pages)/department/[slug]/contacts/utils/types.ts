export type Contact = {
  id?: number;
  uid: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
};
