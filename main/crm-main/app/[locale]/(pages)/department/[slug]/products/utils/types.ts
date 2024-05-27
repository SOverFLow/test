export type Product = {
    buy_price: number | null
    entry_date: string | null
    exit_date: string | null
    expiration_date: string | null
    id: number
    name: string
    image: string | null
    payment_method: string | null
    quantity: number
    sell_price: number | null
    department_cost_id: string | null
    department_id: string
    stock_id: string | null
    supplier_id: string | null
    task_id: string | null
    uid: string
    product_family: string | null
    stock_limit_for_alert: number | null
    sell_tva: string | null
    buy_tva: string | null
    sell_price_ttc: string | null
    buy_price_ttc: string | null
};
