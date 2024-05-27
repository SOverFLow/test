export type Student = {
  address: string | null;
  avatar: string | null;
  budget: string;
  client_id: string | null;
  created_at: string;
  date_of_birth: string | null;
  email: string;
  first_name: string;
  last_name: string;
  level: string | null;
  notes: string | null;
  phone: string;
  registration_date: string | null;
  status: string | null;
  uid: string;
  payment_method: string | null;
  social_security_number: string | null;
};



type SubObject = { [subKey: string]: boolean };
export type ObjectStructure = { [key: string]: SubObject };
