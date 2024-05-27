/******************************************************************************
 * @Author                : a-str-o<younes.elguer@gmail.com>                  *
 *                                                                            *
 *                                                                            *
 *****************************************************************************/

"use server";

import { getDbOnSever } from "@/utils/supabase/cookie";

const getInvoiceData = async (InvoiceID: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Invoice")
    .select(
      "title,date_issued,due_date,currency,\
        Company(logo,name,address,country,city,zip_code),\
        Client(first_name,last_name,address,city,country, email),\
        Task(Product(notes,quantity,sell_price),\
      selected_products_out_stock,selected_products_in_stock,services)"
    )
    .eq("uid", InvoiceID);
  if (!data) return {};

  const out_stock = data[0].Task?.selected_products_out_stock?.map(
    (product: any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        rate: product?.sell_price?.toString() as string,
      };
    }
  );

  const in_stock = data[0].Task?.selected_products_in_stock?.map(
    (product: any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        rate: product?.sell_price.toString() as string,
      };
    }
  );

  const services = data[0].Task?.services?.map((product: any) => {
    return {
      description: product?.selection?.title as string,
      quantity: product?.quantity?.toString() as string,
      rate: product?.selection?.selling_price?.toString() as string,
    };
  });
  const returnData = {
    logo: data[0].Company?.logo as string,
    title: data[0].title as string,
    companyName: data[0].Company?.name as string,
    companyAddress: data[0].Company?.address as string,
    companyAddress2: (data[0].Company?.city +
      " " +
      data[0].Company?.zip_code) as string,
    companyCountry: data[0].Company?.country as string,
    clientName: (data[0].Client?.first_name +
      " " +
      data[0].Client?.last_name) as string,
    clientAddress: data[0].Client?.address as string,
    clientAddress2: data[0].Client?.city as string,
    clientCountry: data[0].Client?.country as string,
    clientEmail: data[0].Client?.email as string,
    invoiceTtile: data[0].title as string,
    invoiceDate: data[0].date_issued as string,
    invoiceDueDate: data[0].due_date as string,
    currency: data[0].currency as string,
    productLines: [
      ...(services || []),
      ...(in_stock || []),
      ...(out_stock || []),
    ],
  };
  return returnData;
};

const getDiscount = async (serviceId: string, bienId: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Contract")
    .select("contract_service(discount,service_id)")
    .eq("bien_id", bienId);
  if (!data) return 0;
  if (error) {
    console.log("error discount:", error);
    return 0;
  }
  if (!data[0].contract_service) return 0;
  const discount = data[0].contract_service.map((service: any) => {
    if (service.service_id === serviceId) return service.discount;
  });
  console.log("discount:", discount);
  return discount;
};

const getDevisData = async (DevisID: string) => {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  console.log("user: ", user);
  const { data, error } = await supabase
    .from("Devis")
    .select(
      "reference,title,date_issued,due_date,currency,\
        Company(logo,name,address,country,city,zip_code,note,email,phone,siret,capital,conditions_bank),\
        Client(first_name,last_name,address,city,country, email),\
        Task(Product(notes,quantity,sell_price),\
      selected_products_out_stock,selected_products_in_stock,services,bien_id)"
    )
    .eq("uid", DevisID);
  console.log("data33: ", data);
  console.log("error33: ", error);
  if (!data) return {};
  if (error) {
    console.log("error first fetch devis", error);
    return {};
  }
  // console.log("data1: ", data);
  // console.log("data1: ", data[0]?.Task?.services);
  // console.log("dataproduct: ", data[0]?.Task?.selected_products_out_stock);
  const { data: bank, error: bankError } = await supabase
    .from("Bank")
    .select("iban_number,bic_swift_code")
    .eq("user_id", user.id)
    .eq("is_active", true);
  if (!bank || !data || !data[0]) return {};
  if (bankError) {
    console.log("error second bank devis:", bankError);
    return {};
  }
  const in_stock = data[0]?.Task?.selected_products_in_stock?.map(
    (product: any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        tva: product?.sell_tva?.value?.toString() as string,
        discount: "0",
        price: product?.sell_price?.toString() as string,
      };
    }
  );
  const out_stock = data[0].Task?.selected_products_out_stock?.map(
    (product: any) => {
      return {
        description: product?.name as string,
        quantity: product?.quantity?.toString() as string,
        tva: product?.sell_tva?.value?.toString() as string,
        discount: "0",
        price: product?.sell_price?.toString() as string,
      };
    }
  );
  const getDiscountString = async (
    uid: string,
    bienId: string
  ): Promise<string> => {
    try {
      const discount = await getDiscount(uid, bienId);
      return discount.toString();
    } catch (error) {
      console.log("error discount:", error);
      return "0";
    }
  };

  const services = await Promise.all(
    data[0].Task?.services?.map(async (product: any) => {
      const discount = await getDiscountString(
        product?.selection?.uid,
        data[0].Task?.bien_id as string
      );
      return {
        description: product?.selection?.title as string,
        quantity: product?.quantity?.toString() as string,
        tva: product?.selection?.tva?.toString() as string,
        discount: discount,
        price: product.selection?.selling_price_ht?.toString() as string,
      };
    }) || []
  );

  // console.log("services: ", services);
  // console.log("in_stock: ", in_stock);
  // console.log("out_stock: ", out_stock);
  // console.log("client",data[0].Client)
  const returnData = {
    invoiceTitle: data[0].reference as string,
    logo: data[0].Company?.logo as string,
    title: data[0].title as string,
    companyName: data[0].Company?.name as string,
    companyAddress: data[0].Company?.address as string,
    companyAddress2: (data[0].Company?.city +
      " " +
      data[0].Company?.zip_code) as string,
    companyCountry: data[0].Company?.country as string,
    clientName: (data[0].Client?.first_name +
      " " +
      data[0].Client?.last_name) as string,
    clientAddress: data[0].Client?.address as string,
    clientAddress2: data[0].Client?.city as string,
    clientCountry: data[0].Client?.country as string,
    clientEmail: data[0].Client?.email as string,
    devisTtile: data[0].title as string,
    devisDate: data[0].date_issued as string,
    devisDueDate: data[0].due_date as string,
    currency: data[0].currency as string,
    companyPhone: data[0].Company?.phone as string,
    companyEmail: data[0].Company?.email as string,
    companySiret: data[0].Company?.siret as string,
    companyCapital: data[0].Company?.capital as string,
    notes: data[0].Company?.note as string,
    conditionsBank: data[0].Company?.conditions_bank as string,
    companyBICSWIFT: bank[0]?.bic_swift_code as string,
    companyIBAN: bank[0]?.iban_number as string,
    productLines: [
      ...(services || []),
      ...(in_stock || []),
      ...(out_stock || []),
    ],
  };
  return returnData;
};

const getAllDevis = async (department_id: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Devis")
    .select(
      "uid,id,reference,title,date_issued,devis_price,status,currency,Client(first_name,last_name,address,city,country,email),tva"
    )
    .order("id", { ascending: false })
    .eq("department_id", department_id);
  if (!data) return [];
  const statusFormat = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  const returnData = data.map((devis) => {
    return {
      uid: devis.uid as string,
      id: ("devis_00" + devis.id.toString()) as string,
      title: devis.title as string,
      startDate: devis.date_issued as string,
      amount: devis.devis_price as number,
      currency: devis.currency as string,
      status: statusFormat(devis.status?.toString() as string),
      client: (devis.Client?.first_name +
        " " +
        devis.Client?.last_name) as string,
      tva: devis.tva as string,
    };
  });
  return returnData;
};

const getAllInvoices = async (department_id: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Invoice")
    .select("uid,id,reference,title,date_issued,invoice_price,status,currency")
    .order("id", { ascending: false })
    .eq("department_id", department_id);
  if (!data) return [];
  const statusFormat = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  const returnData = data.map((invoice) => {
    return {
      uid: invoice.uid as string,
      id: ("ref_" + invoice.id.toString()) as string,
      name: invoice.title as string,
      startDate: invoice.date_issued as string,
      amount: `${invoice.currency?.toString()}${invoice.invoice_price?.toString()}`,
      status: statusFormat(invoice.status?.toString() as string),
    };
  });
  return returnData;
};

const getIfDepartmentIsFormation = async (slug: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Department")
    .select("is_center_formation")
    .eq("uid", slug);
  if (!data) return false;
  if (error) {
    console.log(error);
    return false;
  }
  return data[0].is_center_formation as boolean;
};
export default getInvoiceData;
export {
  getAllDevis,
  getAllInvoices,
  getIfDepartmentIsFormation,
  getDevisData,
};
