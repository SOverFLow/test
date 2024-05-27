type InputObject = {
    [key: string]: {
        [subKey: string]: boolean;
    };
};

type MatcherObject = {
    [key: string]: {
        [subKey: string]: {
            [field: string]: string;
        };
    };
};

export default function parseInput(inputObject: InputObject): { [key: string]: { [field: string]: boolean } } {
    const result: { [key: string]: { [field: string]: boolean } } = {};

    // Initialize structure based on matcherObject
    for (const [mainKey, subKeys] of Object.entries(matcherObject)) {
        result[mainKey] = {};
        for (const subKey of Object.keys(subKeys)) {
            for (const field of Object.keys(subKeys[subKey])) {
                result[mainKey][field] = false; // Initialize all fields to false
            }
        }
    }

    // Set true values based on inputObject
    for (const [mainKey, subObjects] of Object.entries(inputObject)) {
        for (const [subKey, isActive] of Object.entries(subObjects)) {
            if (isActive && matcherObject[mainKey] && matcherObject[mainKey][subKey]) {
                for (const field of Object.keys(matcherObject[mainKey][subKey])) {
                    result[mainKey][field] = true; // Set to true if active
                }
            }
        }
    }

    return result;
}

export function matchPermissions(permissionData: InputObject): any {
    const result: any = {};

    Object.keys(matcherObject).forEach(category => {
        const categoryPermissions = permissionData[category] || {};
        result[category] = {};
        Object.keys(matcherObject[category]).forEach(subCategory => {
            const fields = Object.keys(matcherObject[category][subCategory]);
            // Check if every field in subCategory is true in permissionData
            const allTrue = fields.every(field => categoryPermissions[field] === true);
            result[category][subCategory] = allTrue;
        });
    });

    return result;
}

const matcherObject: MatcherObject = {
    "TVA":{
        "TVA":{
            "id": "",
            "uid": "",
            "name": "",
            "value": "",
            "country": "",
            "created_at": "",
            "updated_at": "",
            "description": "",
            "department_id": ""
        }
    },
    "Bank": {
        "Bank": {
            "id": "",
            "uid": "",
            "label": "",
            "country": "",
            "user_id": "",
            "currency": "",
            "bank_name": "",
            "is_active": "",
            "created_at": "",
            "updated_at": "",
            "iban_number": "",
            "bank_address": "",
            "account_number": "",
            "bic_swift_code": "",
            "account_owner_name": "",
            "account_owner_address": ""
        }
    },
    "Bien": {
        "Bien": {
            "id": "",
            "uid": "",
            "city": "",
            "name": "",
            "type": "",
            "owner": "",
            "phone": "",
            "price": "",
            "status": "",
            "country": "",
            "location": "",
            "zip_code": "",
            "client_id": "",
            "created_at": "",
            "tasks_done": "",
            "updated_at": "",
            "date_signed": "",
            "description": "",
            "money_earned": "",
            "owner_number": "",
            "stock_needed": "",
            "tasks_failed": "",
            "contract_type": "",
            "department_id": "",
            "money_returned": "",
            "service_wanted": "",
            "state_province": ""
        },
        "Address":{
            "id": "",
            "uid": "",
            "city": "",
            "name": "",
            "phone": "",
            "country": "",
            "location": "",
            "zip_code": "",
            "client_id": "",
            "created_at": "",
            "updated_at": "",
            "owner_number": "",
            "stock_needed": "",
            "contract_type": "",
            "service_wanted": "",
            "department_id": "",
            "state_province": ""
        },
        "Price":{
            "id": "",
            "uid": "",
            "price": "",
            "created_at": "",
            "department_id": "",
            "money_returned": "",
            "description": "",
            "money_earned": "",
            "tasks_done": "",
            "tasks_failed": "",
            "contract_type": "",
            "service_wanted": "",
            "stock_needed": ""
        }
    },
    "Role": {
        "Role": {
            "uid": "",
            "title": "",
            "created_at": "",
            "permissions": "",
            "department_id": ""
        }
    },
    "Task": {
        "Task": {
            "id": "",
            "uid": "",
            "cost": "",
            "long": "",
            "color": "",
            "title": "",
            "images": "",
            "profit_net": "",
            "status": "",
            "address": "",
            "workers": "",
            "end_date": "",
            "end_hour": "",
            "priority": "",
            "client_id": "",
            "column_id": "",
            "confirmed": "",
            "lattitude": "",
            "task_type": "",
            "created_at": "",
            "start_date": "",
            "start_hour": "",
            "updated_at": "",
            "description": "",
            "worker_cost": "",
            "depend_on_id": "",
            "department_id": "",
            "selling_price": "",
            "selected_products_in_stock": "",
            "selected_products_out_stock": ""
        },
        "Description":{
            "id": "",
            "uid": "",
            "color": "",
            "title": "",
            "status": "",
            "description": "",
            "created_at": "",
            "department_id": "",
            "client_id": "",
            "column_id": ""
        },
        "Date":{
            "id": "",
            "uid": "",
            "long": "",
            "color": "",
            "status": "",
            "end_date": "",
            "end_hour": "",
            "priority": "",
            "created_at": "",
            "start_date": "",
            "start_hour": "",
            "updated_at": "",
            "department_id": "",
            "client_id": "",
            "column_id": "",
            "title": ""
        },
        "Images":{
            "id": "",
            "uid": "",
            "images": "",
            "created_at": "",
            "department_id": "",
            "client_id": "",
            "title": "",
            "color": ""
        },
        "Status":{
            "id": "",
            "uid": "",
            "status": "",
            "created_at": "",
            "department_id": "",
            "column_id": "",
            "client_id": "",
            "color": "",
            "title": "",
            "priority": "",
            "confirmed": ""
        },
        "Cost":{
            "id": "",
            "uid": "",
            "cost": "",
            "client_id": "",
            "department_id": "",
            "color": "",
            "status": "",
            "title": "",
            "worker_cost": "",
            "profit_net": "",
            "selling_price": "",
            "selected_products_in_stock": "",
            "selected_products_out_stock": ""
        }
    },
    "Stock": {
        "Stock":{
            "id": "",
            "uid": "",
            "name": "",
            "owner": "",
            "location": "",
            "quantity": "",
            "created_at": "",
            "updated_at": "",
            "expiry_date": "",
            "department_id": "",
            "purchase_date": "",
            "payment_method": ""
        },
        "Quantity": {
            "id": "",
            "uid": "",
            "name": "",
            "quantity": "",
            "created_at": "",
            "department_id": ""
        },
        "Purchase Date": {
            "id": "",
            "uid": "",
            "name": "",
            "purchase_date": "",
            "created_at": "",
            "department_id": ""
        }
    },
    "Client": {
        "Client": {
            "id": "",
            "uid": "",
            "city": "",
            "email": "",
            "phone": "",
            "avatar": "",
            "gender": "",
            "status": "",
            "address": "",
            "country": "",
            "zip_code": "",
            "last_name": "",
            "created_at": "",
            "first_name": "",
            "updated_at": "",
            "date_of_birth": "",
            "state_province": ""
        }
    },
    "Catalog": {
        "Catalog": {
            "id": "",
            "uid": "",
            "area": "",
            "name": "",
            "image": "",
            "width": "",
            "height": "",
            "length": "",
            "volume": "",
            "weight": "",
            "reference": "",
            "created_at": "",
            "updated_at": "",
            "department_id": "",
            "country_of_origin": "",
            "nature_of_product": "",
            "state_province_of_origin": ""
        }
    },
    "Comment": {
        "Comment": {
            "id": "",
            "uid": "",
            "content": "",
            "task_id": "",
            "sender_id": "",
            "created_at": "",
            "sender_img": "",
            "sender_name": ""
        }
    },
    "Company": {
        "Company": {
            "id": "",
            "tva": "",
            "uid": "",
            "city": "",
            "logo": "",
            "name": "",
            "note": "",
            "email": "",
            "phone": "",
            "address": "",
            "country": "",
            "website": "",
            "currency": "",
            "zip_code": "",
            "created_at": "",
            "updated_at": "",
            "pricing_hours": "",
            "working_hours": "",
            "accountant_web": "",
            "accountant_zip": "",
            "super_admin_id": "",
            "accountant_code": "",
            "accountant_name": "",
            "accountant_note": "",
            "accountant_town": "",
            "friday_end_hour": "",
            "monday_end_hour": "",
            "sunday_end_hour": "",
            "accountant_email": "",
            "accountant_phone": "",
            "tuesday_end_hour": "",
            "friday_start_hour": "",
            "monday_start_hour": "",
            "saturday_end_hour": "",
            "sunday_start_hour": "",
            "thursday_end_hour": "",
            "accountant_address": "",
            "accountant_country": "",
            "tuesday_start_hour": "",
            "wednesday_end_hour": "",
            "saturday_start_hour": "",
            "thursday_start_hour": "",
            "wednesday_start_hour": "",
            "minimal_minutes_per_task": ""
        }
    },
    "Contact": {
        "Contact":{
            "id": "",
            "uid": "",
            "role": "",
            "email": "",
            "phone": "",
            "address": "",
            "full_name": "",
            "created_at": "",
            "updated_at": "",
            "department_id": ""
        },
        "Full Name":{
            "id": "",
            "uid": "",
            "full_name": "",
            "created_at": "",
            "department_id": ""
        },
        "Phone":{
            "id": "",
            "uid": "",
            "phone": "",
            "created_at": "",
            "department_id": ""
        },
        "Role":{
            "id": "",
            "uid": "",
            "role": "",
            "created_at": "",
            "department_id": ""
        }
    },
    "Invoice":{
        "Invoice":{
            "id": "",
            "uid": "",
            "type": "",
            "title": "",
            "status": "",
            "task_id": "",
            "currency": "",
            "due_date": "",
            "client_id": "",
            "confirmed": "",
            "reference": "",
            "worker_id": "",
            "company_id": "",
            "created_at": "",
            "updated_at": "",
            "date_issued": "",
            "department_id": "",
            "invoice_price": "",
            "link_in_bucket": ""
        },
        "Status":{
            "id": "",
            "uid": "",
            "type": "",
            "title": "",
            "status": "",
            "created_at": "",
            "department_id": "",
            "task_id": "",
            "currency": "",
            "due_date": "",
            "confirmed": "",
            "reference": "",
            "worker_id": "",
            "company_id": "",
            "link_in_bucket": ""
        }
    },
    "Product":{
        "Product":{
            "id": "",
            "uid": "",
            "name": "",
            "image": "",
            "notes": "",
            "price": "",
            "task_id": "",
            "quantity": "",
            "stock_id": "",
            "buy_price": "",
            "exit_date": "",
            "catalog_id": "",
            "created_at": "",
            "entry_date": "",
            "sell_price": "",
            "updated_at": "",
            "supplier_id": "",
            "department_id": "",
            "desired_stock": "",
            "serial_number": "",
            "payment_method": "",
            "expiration_date": "",
            "department_cost_id": "",
            "stock_limit_for_alert": ""
        },
        "Quantity":{
            "id": "",
            "uid": "",
            "name": "",
            "image": "",
            "notes": "",
            "task_id": "",
            "quantity": "",
            "stock_id": "",
            "exit_date": "",
            "catalog_id": "",
            "created_at": "",
            "entry_date": "",
            "updated_at": "",
            "supplier_id": "",
            "department_id": "",
            "desired_stock": "",
            "serial_number": "",
            "expiration_date": "",
            "stock_limit_for_alert": ""
        },
        "Price": {
            "id": "",
            "uid": "",
            "name": "",
            "image": "",
            "notes": "",
            "price": "",
            "task_id": "",
            "stock_id": "",
            "buy_price": "",
            "catalog_id": "",
            "created_at": "",
            "sell_price": "",
            "updated_at": "",
            "supplier_id": "",
            "department_id": "",
            "desired_stock": "",
            "serial_number": "",
            "payment_method": "",
            "department_cost_id": "",
            "stock_limit_for_alert": ""
        }
    },
    "Service": {
        "Service": {
            "id": "",
            "tva": "",
            "uid": "",
            "title": "",
            "units": "",
            "amount": "",
            "discount": "",
            "reference": "",
            "created_at": "",
            "margin_rate": "",
            "department_id": "",
            "selling_price": "",
            "purchase_price": ""
        }
    },
    "Contract": {
        "Contract": {
            "id": "",
            "uid": "",
            "end_date": "",
            "catalog_id": "",
            "created_at": "",
            "start_date": "",
            "updated_at": "",
            "department_id": ""
        }
    },
    "Supplier":{
        "Supplier":{
            "fax": "",
            "tva": "",
            "uid": "",
            "city": "",
            "name": "",
            "email": "",
            "address": "",
            "country": "",
            "website": "",
            "cuurency": "",
            "zip_code": "",
            "created_at": "",
            "updated_at": "",
            "bank_account": "",
            "phone_number": "",
            "department_id": "",
            "supplier_type": "",
            "profesional_id": "",
            "state_province": "",
            "supplier_category": "",
            "representative_company": ""
        }
    },
    "TaskCost":{
        "TaskCost":{
            "id": "",
            "uid": "",
            "name": "",
            "type": "",
            "price": "",
            "status": "",
            "task_id": "",
            "created_at": "",
            "updated_at": "",
            "date_issued": "",
            "description": ""
        },
        "Type":{
            "id": "",
            "uid": "",
            "type": "",
            "task_id": "",
            "created_at": ""
        },
        "Status":{
            "id": "",
            "uid": "",
            "status": "",
            "task_id": "",
            "created_at": ""
        },
        "Description":{
            "id": "",
            "uid": "",
            "description": "",
            "task_id": "",
            "created_at": ""
        }
    },
    "Department":{
        "Department":{
            "id": "",
            "uid": "",
            "title": "",
            "currency": "",
            "created_at": "",
            "updated_at": "",
            "description": "",
            "super_admin_id": "",
            "is_center_formation": ""
        }
    },
    "SuperAdmin":{
        "SuperAdmin":{
            "id": "",
            "uid": "",
            "email": "",
            "phone": "",
            "avatar": "",
            "gender": "",
            "status": "",
            "last_name": "",
            "created_at": "",
            "first_name": "",
            "updated_at": ""
        }
    },
    "UserWorker":{
        "UserWorker":{
            "id": "",
            "uid": "",
            "city": "",
            "color": "",
            "email": "",
            "notes": "",
            "phone": "",
            "avatar": "",
            "gender": "",
            "status": "",
            "address": "",
            "country": "",
            "zip_code": "",
            "last_name": "",
            "created_at": "",
            "first_name": "",
            "salary_day": "",
            "updated_at": "",
            "salary_hour": "",
            "hours_worked": "",
            "job_position": "",
            "salary_month": "",
            "task_cost_id": "",
            "date_of_birth": "",
            "supervisor_id": "",
            "licence_number": "",
            "state_province": "",
            "employment_date": "",
            "security_number": ""
        },
        "Salary Information":{
            "id": "",
            "uid": "",
            "email": "",
            "phone": "",
            "avatar": "",
            "gender": "",
            "status": "",
            "address": "",
            "country": "",
            "zip_code": "",
            "last_name": "",
            "created_at": "",
            "first_name": "",
            "salary_day": "",
            "updated_at": "",
            "salary_hour": "",
            "hours_worked": "",
            "job_position": "",
            "salary_month": "",
            "task_cost_id": "",
            "licence_number": "",
            "notes": "",
            "security_number": ""
        },
        "Employee Information":{
            "id": "",
            "uid": "",
            "city": "",
            "color": "",
            "email": "",
            "phone": "",
            "avatar": "",
            "gender": "",
            "status": "",
            "address": "",
            "country": "",
            "zip_code": "",
            "last_name": "",
            "created_at": "",
            "first_name": "",
            "supervisor_id": "",
            "state_province": "",
            "employment_date": "",
            "date_of_birth": "",
            "job_position": "",
            "licence_number": "",
            "notes": "",
            "security_number": ""
        }
    },
    "Amortization": {
        "Amortization": {
            "uid": "",
            "year": "",
            "net_book": "",
            "book_value": "",
            "created_at": "",
            "department_id": "",
            "acquisition_date": "",
            "value_of_the_asset": "",
            "last_year_useful_life": "",
            "first_year_useful_life": "",
            "accumulated_depreciation": "",
            "depreciation_installment": "",
            "start_date_of_the_fiscal_year": "",
            "number_of_years_of_depreciation": ""
        }
    },
    "DepartmentCost":{
        "Department Cost":{
            "id": "",
            "uid": "",
            "type": "",
            "price": "",
            "status": "",
            "cost_name": "",
            "created_at": "",
            "updated_at": "",
            "date_issued": "",
            "description": "",
            "department_id": ""
        }
    },
    "ContractCatalog": {
        "ContractCatalog": {
            "id": "",
            "uid": "",
            "terms": "",
            "title": "",
            "created_at": "",
            "description": "",
            "department_id": ""
        }
    }
};
// const result = parseInput(inputObject);
// console.log(result);
