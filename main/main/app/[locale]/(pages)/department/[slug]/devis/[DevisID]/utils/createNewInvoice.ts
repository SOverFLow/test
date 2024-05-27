'use server';
import { getDbOnSever } from "@/utils/supabase/cookie";

function generateProductReference(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";        
    return letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length)) + Math.floor(Math.random() * Math.pow(10, 6)).toString() + letters.charAt(Math.floor(Math.random() * letters.length));
}

// Example usage:
console.log(generateProductReference());

interface Props {
    title: string,
    description: string,
    address: any,
    workers: string[],
    status: string,
    priority: string,
    client_id: string,
    cost: string,
    long: number,
    lattitude: number,
    start_date: any,
    end_date: any,
    task_type: string,
    start_hour: number,
    end_hour: number,
    depend_on_id: string,
    department_id: string,
    selectedProductsOutStock: any[],
    selectedProductsInStock: any[],
    services: any[],
};

const createNewInvoice = async (params:Props,uid:string) => {
    const supabase = await getDbOnSever();
    const newReference = generateProductReference();
    if (!uid)
        return null;
    const {data:depart,error:errdap} = await supabase.from('Department').select('super_admin_id').eq('uid',params.department_id);
    if (errdap) {
        console.log('error1',errdap);
        return errdap;
    }
    if (!depart || depart.length === 0) {
        console.log('error','no data depart');
        return null;
    }

    const {data:company,error:errorCompany} = await supabase.from('Company').select('uid,currency').eq('super_admin_id',depart[0]?.super_admin_id);
    if (errorCompany) {
        console.log('errorcompany',errorCompany);
        return errorCompany;
    }
    if (!company || company.length === 0) {
        console.log('error2','no data company');
        return null;
    }

    const { data, error } = await supabase
        .from("Invoice")
        .insert([
            {
                department_id: params.department_id as string,
                task_id: uid,
                client_id: params.client_id as string,
                // worker_id: params.worker_id[0] as string,
                company_id: company[0]?.uid as string,
                title: params.title as string,
                date_issued: new Date().toISOString(),
                due_date: new Date().toISOString(),
                currency: company[0]?.currency as string,
                reference: newReference as string,
                status: 'pending' as string,
                invoice_price: Number(params.cost),
            }
        ]).select();
    if (error) {
        console.log('error3',error);
        return error;
    }

    return null;
}


const createNewDevis = async (params:Props,uid:string) => {
    const supabase = await getDbOnSever();
    const newReference = generateProductReference();
    if (!uid)
        return null;
    const {data:depart,error:errdap} = await supabase.from('Department').select('super_admin_id').eq('uid',params.department_id);
    if (errdap) {
        console.log('error1',errdap);
        return errdap;
    }
    if (!depart || depart.length === 0) {
        console.log('error','no data depart');
        return null;
    }

    const {data:company,error:errorCompany} = await supabase.from('Company').select('uid,currency').eq('super_admin_id',depart[0]?.super_admin_id);
    if (errorCompany) {
        console.log('errorcompany',errorCompany);
        return errorCompany;
    }
    if (!company || company.length === 0) {
        console.log('error2','no data company');
        return null;
    }

    const { data, error } = await supabase
        .from("Devis")
        .insert([
            {
                department_id: params.department_id as string,
                task_id: uid,
                client_id: params.client_id as string,
                // worker_id: params.worker_id[0] as string,
                company_id: company[0]?.uid as string,
                title: params.title as string,
                date_issued: new Date().toISOString(),
                due_date: new Date().toISOString(),
                currency: company[0]?.currency as string,
                reference: newReference as string,
                status: 'Pending' as string,
                devis_price: Number(params.cost),
            }
        ]).select();
    if (error) {
        console.log('error3',error);
        return error;
    }

    return null;
}

export { createNewDevis };

export default createNewInvoice;