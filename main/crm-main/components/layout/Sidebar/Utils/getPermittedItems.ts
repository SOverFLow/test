import { createClient } from "@/utils/supabase/client";

/*
{
    "Company": {
        "falsed": "",
        "trued": "id,tva,uid,city,logo,name,note,email,phone,address,country,website,currency,zip_code,created_at,updated_at,pricing_hours,working_hours,accountant_web,accountant_zip,super_admin_id,accountant_code,accountant_name,accountant_note,accountant_town,friday_end_hour,monday_end_hour,sunday_end_hour,accountant_email,accountant_phone,tuesday_end_hour,friday_start_hour,monday_start_hour,saturday_end_hour,sunday_start_hour,thursday_end_hour,accountant_address,accountant_country,tuesday_start_hour,wednesday_end_hour,saturday_start_hour,thursday_start_hour,wednesday_start_hour,minimal_minutes_per_task"
    },
    "UserWorker": {
        "falsed": "",
        "trued": "id,uid,city,color,email,notes,phone,avatar,gender,status,address,country,zip_code,last_name,created_at,first_name,salary_day,updated_at,salary_hour,hours_worked,job_position,salary_month,task_cost_id,date_of_birth,supervisor_id,licence_number,state_province,employment_date,security_number"
    },
    "Bien": {
        "falsed": "",
        "trued": "id,uid,city,name,type,owner,phone,price,status,country,location,zip_code,client_id,created_at,tasks_done,updated_at,date_signed,description,money_earned,owner_number,stock_needed,tasks_failed,contract_type,department_id,money_returned,service_wanted,state_province"
    },
    "Task": {
        "falsed": "",
        "trued": "id,uid,cost,long,color,title,images,status,address,end_date,end_hour,priority,services,client_id,column_id,confirmed,lattitude,task_type,created_at,start_date,start_hour,updated_at,description,worker_cost,depend_on_id,department_id,selected_products_in_stock,selected_products_out_stock"
    },
    "Product": {
        "falsed": "",
        "trued": "id,uid,name,image,notes,price,task_id,quantity,stock_id,buy_price,exit_date,catalog_id,created_at,entry_date,sell_price,updated_at,supplier_id,department_id,desired_stock,serial_number,payment_method,expiration_date,department_cost_id,stock_limit_for_alert"
    },
    "Supplier": {
        "falsed": "",
        "trued": "fax,tva,uid,city,name,email,address,country,website,cuurency,zip_code,created_at,updated_at,bank_account,phone_number,department_id,supplier_type,profesional_id,state_province,supplier_category,representative_company"
    },
    "Invoice": {
        "falsed": "",
        "trued": "id,uid,title,status,task_id,currency,due_date,client_id,confirmed,reference,worker_id,company_id,created_at,updated_at,date_issued,department_id,invoice_price,link_in_bucket"
    },
    "Client": {
        "falsed": "",
        "trued": "id,uid,city,email,phone,avatar,gender,status,address,country,zip_code,last_name,created_at,first_name,updated_at,date_of_birth,state_province"
    },
    "Catalog": {
        "falsed": "",
        "trued": "id,uid,area,name,image,width,height,length,volume,weight,reference,created_at,updated_at,department_id,country_of_origin,nature_of_product,state_province_of_origin"
    },
    "Bank": {
        "falsed": "",
        "trued": "id,uid,label,country,user_id,currency,bank_name,is_active,created_at,updated_at,iban_number,bank_address,account_number,bic_swift_code,account_owner_name,account_owner_address"
    },
    "Amortization": {
        "falsed": "",
        "trued": "uid,year,net_book,book_value,created_at,department_id,acquisition_date,value_of_the_asset,last_year_useful_life,first_year_useful_life,accumulated_depreciation,depreciation_installment,start_date_of_the_fiscal_year,number_of_years_of_depreciation"
    },
    "Stock": {
        "falsed": "",
        "trued": "id,uid,name,owner,location,quantity,created_at,updated_at,expiry_date,department_id,purchase_date,payment_method"
    },
    "TaskCost": {
        "falsed": "",
        "trued": "id,uid,name,type,price,status,task_id,created_at,updated_at,date_issued,description"
    },
    "SuperAdmin": {
        "falsed": "",
        "trued": "id,uid,email,phone,avatar,gender,status,last_name,created_at,first_name,updated_at"
    },
    "DepartmentCost": {
        "falsed": "",
        "trued": "id,uid,type,price,status,cost_name,created_at,updated_at,date_issued,description,department_id"
    },
    "Contact": {
        "falsed": "",
        "trued": "id,uid,role,email,phone,address,full_name,created_at,updated_at,department_id"
    },
    "TVA": {
        "falsed": "",
        "trued": "id,uid,name,value,country,created_at,updated_at,description,department_id"
    },
    "Comment": {
        "falsed": "",
        "trued": "id,uid,content,task_id,sender_id,created_at,sender_img,sender_name"
    },
    "Contract": {
        "falsed": "",
        "trued": "id,uid,end_date,catalog_id,created_at,start_date,updated_at,department_id"
    },
    "Department": {
        "falsed": "",
        "trued": "id,uid,title,currency,created_at,updated_at,description,super_admin_id"
    },
    "Service": {
        "falsed": "",
        "trued": "id,uid,title,units,created_at,department_id,selling_price"
    },
    "ContractCatalog": {
        "falsed": "",
        "trued": "id,uid,terms,title,created_at,description,department_id"
    },
    "Role": {
        "falsed": "",
        "trued": "uid,title,created_at,permissions,department_id"
    },
    "TaskColumn": {
        "falsed": "",
        "trued": "id,uid,title,created_at,department_id"
    },
}
*/

export interface DataObject {
  [key: string]: {
    falsed: string;
    trued: string;
  };
}

function filterNonEmptyTruedKeys(dataObject: DataObject) {
  const nonEmptyKeys = [];
  for (const key in dataObject) {
    if (dataObject[key].trued !== "") {
      nonEmptyKeys.push(key);
    }
  }
  return nonEmptyKeys;
}

export default async function getPermittedItems(departmentId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
//   console.log("user role2: ", user.data.user?.role);
  if (user.data.user?.role === undefined) {
    return { error: "No role found", data: null };
  }
  const { data: roles, error } = await supabase
    .from("Role")
    .select("permissions")
    .eq("title", user.data.user?.role);
  if (error || !roles[0]) {
    console.log("error fetching roles: ", error);
    return { error: "error fetching roles", data: null };
  }
  const permittedItems = filterNonEmptyTruedKeys(
    roles[0].permissions as DataObject
  );
//   console.log("permittedItems: ", permittedItems);
  return { error: null, data: permittedItems };
}
