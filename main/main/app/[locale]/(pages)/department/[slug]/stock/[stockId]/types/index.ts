export interface Product {
  uid: string;
  name: string;
  price: number | null;
  quantity: number | null;
  imageUrl: string | null;
}

export interface StockItem {
  name: string | null;
  created_at: string;
  expiry_date: string | null;
  location: string | null;
  owner: string | null;
  payment_method: string | null;
  purchase_date: string | null;
  type: string | null;
  uid: string;
}
