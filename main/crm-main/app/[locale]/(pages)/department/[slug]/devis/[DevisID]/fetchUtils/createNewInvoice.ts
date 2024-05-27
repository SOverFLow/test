'use client';
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

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
    worker_id: string,
    status_id: string,
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
    selectedProductsOutStock: any[],
    selectedProductsInStock: any[],
};
// const tasks:Props = {
//     title: 'title',
//     description: 'description',
//     address: 'address',
//     worker_id: '61311e59-2f52-459d-8017-0c0a0ea5a941',
//     status_id: 'f4b72d38-10e7-4b3a-962a-44625e0ca3aa',
//     priority: 'priority',
//     client_id: 'f4b72d38-10e7-4b3a-962a-44625e0ca3aa',
//     cost: 'cost',
//     long: 0,
//     lattitude: 0,
//     start_date: new Date(),
//     end_date: new Date(),
//     task_type: 'task_type',
//     start_hour: 0,
//     end_hour: 0,
//     depend_on_id: 'f4b72d38-10e7-4b3a-962a-44625e0ca3aa',
//     selectedProductsOutStock: [],
//     selectedProductsInStock: [],
// }

// const task:Database['public']['Tables']['Task']['Row'] = {
//     uid: '29104bfc-9781-45d4-be10-83f05df37e71',
//     title: '23',
//     description: 'description',
//     address: 'yess doneee',
//     status_id: null,
//     priority: 'priority',
//     client_id: 'f4b72d38-10e7-4b3a-962a-44625e0ca3aa',
//     cost: 45,
//     long: 0,
//     lattitude: 0,
//     start_date: new Date().toString(),
//     end_date: new Date().toString(),
//     task_type: 'task_type',
//     start_hour: '2',
//     end_hour: '4',
//     depend_on_id: null,
//     selectedProductsOutStock: [],
//     id: 0,
//     department_id: 'c58a6f3d-6dc2-44d4-b670-e212e2746090',
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//     worker_cost: null,
//     images: null,
//     consumables: null,
//     color: null,
// };

//   const newInvoice = createNewInvoice(tasks,task);


const createNewInvoice = async (params:Props,task:Database['public']['Tables']['Task']['Row']) => {
    const supabase = createClient();
    const newReference = generateProductReference();

    const {data:depart,error:errdap} = await supabase.from('Department').select('super_admin_id').eq('uid',task.department_id);
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
                department_id: task.department_id as string,
                task_id: task.uid.toString(),
                client_id: task.client_id as string,
                worker_id: params.worker_id as string,
                company_id: company[0]?.uid as string,
                title: task.title as string,
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
// export { createNewDevis };
export default createNewInvoice;