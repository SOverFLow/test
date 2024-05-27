export interface Biens {
  uid: string;
  name: string;
  type: string;
  price: number;
  location: string | null;
  created_at: string;
  status: string;
}

export interface FormBien {
  name: string;
  type: string;
  price: number;
  description: string | null;
  location: string | null;
}
