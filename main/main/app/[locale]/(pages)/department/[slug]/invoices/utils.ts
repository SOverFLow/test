"use server";
import { getDbOnSever } from "@/utils/supabase/cookie";

const generateReference = async () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return (
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    Math.floor(Math.random() * Math.pow(10, 6)).toString() +
    letters.charAt(Math.floor(Math.random() * letters.length))
  );
};

const getInvoiceData = async (InvoiceID: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Invoice")
    .select("confirmed,link_in_bucket,Client(email)")
    .eq("uid", InvoiceID);
  if (error) {
    console.log(error);
    return null;
  }
  if (!data) return false;
  return data[0];
};

const InvoiceDataToAvoir = async (InvoiceID: string) => {
  const supabase = await getDbOnSever();
  const { data: oldInvoice, error } = await supabase
    .from("Invoice")
    .select("*")
    .eq("uid", InvoiceID)
    .single();
  if (error) {
    console.log(error);
    console.log("==================wwww", error);
    return null;
  }
  if (!oldInvoice) return false;
  console.log("==================wwww", oldInvoice);
  const { data: invoice, error: invoiceError } = await supabase
    .from("Invoice")
    .insert([
      {
        department_id: oldInvoice?.department_id as string,
        task_id: oldInvoice?.task_id as string,
        client_id: oldInvoice?.client_id as string,
        worker_id: oldInvoice.worker_id as string,
        company_id: oldInvoice.company_id as string,
        title: oldInvoice.title as string,
        date_issued: oldInvoice.date_issued as string,
        due_date: oldInvoice.due_date as string,
        currency: oldInvoice.currency as string,
        reference: (oldInvoice.reference + "_avoir") as string,
        status: "avoir" as string,
        invoice_price: ((oldInvoice?.invoice_price || 0) * -1) as number,
        // link_in_bucket: oldInvoice.link_in_bucket as string,
      },
    ])
    .select();
  if (invoiceError) {
    console.log("error3", error);
    return error;
  }
  return invoice;
};

const getDevisData = async (DevisID: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Devis")
    .select("confirmed,link_in_bucket")
    .eq("uid", DevisID);
  if (error) {
    console.log(error);
    return null;
  }
  if (!data) return false;
  return data[0];
};

const updateDevisStatus = async (DevisID: string, status: string) => {
  const supabase = await getDbOnSever();
  if (status === "Confirmed") {
    const { data, error } = await supabase
      .from("Devis")
      .update({ status: status, confirmed: true })
      .eq("uid", DevisID)
      .select();
    if (error) {
      console.log(error);
      return null;
    }
    if (!data) return false;
    return data[0];
  }
  const { data, error } = await supabase
    .from("Devis")
    .update({ status: status })
    .eq("uid", DevisID)
    .select();
  if (error) {
    console.log(error);
    return null;
  }
  if (!data) return false;
  return data[0];
};


const updateInvoiceStatus = async (InvoiceID: string, status: string) => {
  const supabase = await getDbOnSever();
  if (status === "paid") {
    const { data, error } = await supabase
      .from("Invoice")
      .update({ status: status, confirmed: true })
      .eq("uid", InvoiceID)
      .select();
    if (error) {
      console.log(error);
      return null;
    }
    if (!data) return false;
    return data[0];
  }
  const { data, error } = await supabase
    .from("Invoice")
    .update({ status: status })
    .eq("uid", InvoiceID)
    .select();
  if (error) {
    console.log(error);
    return null;
  }
  if (!data) return false;
  return data[0];
};

const getInvoiceDataFromDevis = async (DevisID: string) => {
  const supabase = await getDbOnSever();
  const { data: devis, error } = await supabase
    .from("Devis")
    .select("*")
    .eq("uid", DevisID)
    .single();
  if (error) {
    console.log(error);
    return null;
  }
  if (!devis) return false;

  const { data: invoice, error: invoiceError } = await supabase
    .from("Invoice")
    .insert([
      {
        department_id: devis.department_id as string,
        task_id: devis.task_id as string,
        client_id: devis.client_id as string,
        worker_id: devis.worker_id as string,
        company_id: devis.company_id as string,
        title: devis.title as string,
        date_issued: devis.date_issued as string,
        due_date: devis.due_date as string,
        currency: devis.currency as string,
        reference: devis.reference as string,
        status: "pending" as string,
        invoice_price: devis.devis_price as number,
        link_in_bucket: devis.link_in_bucket as string,
      },
    ])
    .select();
  if (invoiceError) {
    console.log("error3", error);
    return error;
  }
  return invoice;
};

const DuplicateDevis = async (DevisID: string, NewDevis: any) => {
  const supabase = await getDbOnSever();
  const { data: devis, error } = await supabase
    .from("Devis")
    .select("*")
    .eq("uid", DevisID)
    .single();
  if (error) {
    console.log(error);
    return null;
  }
  if (!devis) return false;

  const { data: duplicatedDevis, error: devisError } = await supabase
    .from("Devis")
    .insert([
      {
        department_id: devis.department_id as string,
        task_id: devis.task_id as string,
        client_id: devis.client_id as string,
        worker_id: devis.worker_id as string,
        company_id: devis.company_id as string,
        title: NewDevis?.title as string,
        // date_issued: NewDevis?.startDate as string,
        due_date: devis.due_date as string,
        currency: devis.currency as string,
        reference: (await generateReference()) as string,
        status: "pending" as string,
        devis_price: NewDevis?.amount as number,
        tva: NewDevis?.tva as string,
      },
    ])
    .select();
  if (devisError) {
    console.log("error3", error);
    return error;
  }
  return duplicatedDevis;
};

export {
  getDevisData,
  getInvoiceDataFromDevis,
  InvoiceDataToAvoir,
  DuplicateDevis,
  updateDevisStatus,
  updateInvoiceStatus
};

export default getInvoiceData;
