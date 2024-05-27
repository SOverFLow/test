export interface Product {
  name: string;
  quantity: number;
  sell_price: number;
  buy_price: number;
  supplier_id: string | null;
  entry_date: Date | null;
  exit_date: Date | null;
  expiration_date: Date | null;
  payment_method: string;
  serial_number: string;
  stock_limit_for_alert: number;
  desired_stock: number;
  notes: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  area: number;
  volume: number;
  country_of_origin: string;
  state_province_of_origin: string;
  nature_of_product: string;
  image: string;
  buy_tva: string | null;
  sell_tva: string | null;
}
