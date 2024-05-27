"use client"

import { FC, useState, useEffect } from 'react'
import { Invoice, ProductLine } from '../data/types'
import { initialInvoice, initialProductLine } from '../data/initialData'
import EditableInput from './EditableInput'
import EditableSelect from './EditableSelect'
import EditableTextarea from './EditableTextarea'
import EditableCalendarInput from './EditableCalendarInput'
import EditableFileImage from './EditableFileImage'
import countryList from '../data/countryList'
import Document from './Document'
import Page from './Page'
import View from './View'
import Text from './Text'
import EditableInputMulty from './EditableInputMulty'
import { format } from 'date-fns'
import '../scss/main.scss'


interface Props {
  data?: Invoice
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

function convertWebPToPNG(webpUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // This enables CORS for the image
    img.src = webpUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}



const DevisPage: FC<Props> = ({ data, pdfMode, onChange }) => {
  const searchParams = new URLSearchParams(window.location.search)
  const query = searchParams.get('avoir')

  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
  const [subTotal, setSubTotal] = useState<number>(0)
  const [subTotalTCC, setSubTotalTCC] = useState<number>(0)
  const [saleTax, setSaleTax] = useState<number>()
  const [imageLogo, setImageLogo] = useState<string>("")

  console.log('this is data:', data);
  console.log('this is data.prodict line:', data?.productLines);

  const dateFormat = 'MMM dd, yyyy'
  const invoiceDate = invoice.invoiceDate !== '' ? new Date(invoice.invoiceDate) : new Date()
  const invoiceDueDate =
    invoice.invoiceDueDate !== ''
      ? new Date(invoice.invoiceDueDate)
      : new Date(invoiceDate.valueOf())

  if (invoice.invoiceDueDate === '') {
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30)
  }


  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (name !== 'productLines') {
      const newInvoice = { ...invoice }

      if (name === 'logoWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'logoWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }

      setInvoice(newInvoice)
    }
  }

  const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
    const productLines = invoice.productLines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = { ...productLine }

        if (name === 'description') {
          newProductLine[name] = value
        } else {
          if (
            value[value.length - 1] === '.' ||
            (value[value.length - 1] === '0' && value.includes('.'))
          ) {
            newProductLine[name] = value
          } else {
            const n = parseFloat(value)
            newProductLine[name] = (n ? n : 0).toString()
          }
        }

        return newProductLine
      }

      return { ...productLine }
    })

    setInvoice({ ...invoice, productLines })
  }

  const handleRemove = (i: number) => {
    const productLines = invoice.productLines.filter((_, index) => index !== i)

    setInvoice({ ...invoice, productLines })
  }

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }]

    setInvoice({ ...invoice, productLines })
  }

  const calculateAmount = (quantity: string, price: string, discount:string) => {
    const quantityNumber = parseFloat(quantity)
    const priceNumber = parseFloat(price)
    const less = priceNumber * (discount ? parseFloat(discount) : 0) / 100
    const newAmount = priceNumber - less
    const amount = quantityNumber && newAmount ? quantityNumber * newAmount : 0
    return amount.toFixed(2);
  }
  const calculateAmountttc = (quantity: string, price: string , tva:string,discount:string) => {
    const quantityNumber = parseFloat(quantity)
    const priceNumber = parseFloat(price)
    const tvaa = parseFloat(tva) ? parseFloat(tva) : 0
    const less = priceNumber * (discount ? parseFloat(discount) : 0) / 100
    const newAmount = priceNumber - less
    const amount = quantityNumber && newAmount ? quantityNumber * newAmount: 0
    const ttc = amount + (tvaa * amount / 100)
    return ttc.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0
    let subTotaltcc = 0

    invoice.productLines.forEach((productLine) => {
      const quantityNumber = parseFloat(productLine.quantity) ? parseFloat(productLine.quantity) : 0
      const priceNumber = parseFloat(productLine.price) ? parseFloat(productLine.price) : 0
      const tva = parseFloat(productLine.tva) ? parseFloat(productLine.tva) : 0
      const amount = quantityNumber && priceNumber ? quantityNumber * priceNumber : 0
      const ttc = amount + (tva * amount / 100)
      subTotaltcc += ttc ? ttc : 0
      subTotal += amount ? amount : 0
    })



    setSubTotal(subTotal)
    setSubTotalTCC(subTotaltcc)
  }, [invoice.productLines])
  useEffect(() => {
    
    convertWebPToPNG(invoice.logo)
    .then((pngDataUrl) => {
      console.log("pngDataUrl", pngDataUrl);
      setImageLogo(pngDataUrl);
    })
    .catch((err) => {
      console.error("Error converting image:", err);
    });
  }, [invoice.logo])
  useEffect(() => {
    const match = invoice.discount.match(/(\d+)%/)
    const taxprice = match ? parseFloat(match[1]) : 0
    const saleTax = subTotal ? (subTotal * taxprice) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.discount])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper " pdfMode={pdfMode}>
        <View className="flex " pdfMode={pdfMode}>
          <View className="w-55 mt-20" pdfMode={pdfMode}>
            <EditableFileImage
              className="logo "
              placeholder="Your Logo"
              value={imageLogo}
              width={invoice.logoWidth}
              pdfMode={pdfMode}
              onChangeImage={(value) => handleChange('logo', value)}
              onChangeWidth={(value) => handleChange('logoWidth', value)}
            />
            <EditableInput
              className="fs-17 bold"
              placeholder="Your Company"
              value={invoice.companyName}
              onChange={(value) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
             <EditableTextarea
                  className="dark fs-12"
                  rows={2}
                  placeholder="Company's Address"
                  value={invoice.companyAddress}
                  onChange={(value) => handleChange('companyAddress', value)}
                  pdfMode={pdfMode}
                />
            <EditableSelect
              className="dark fs-12"
              options={countryList}
              value={invoice.companyCountry || "France"}
              onChange={(value) => handleChange('companyCountry', value)}
              pdfMode={pdfMode}
            />
              <EditableInput
              className="fs-12"
              placeholder="company Phone"
              value={invoice.companyPhone}
              onChange={(value) => handleChange('companyPhone', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-12 "
              placeholder="company Email"
              value={invoice.companyEmail}
              onChange={(value) => handleChange('companyEmail', value)}
              pdfMode={pdfMode}
            />
               <View className="flex" pdfMode={pdfMode}>
                <View className="w-30" pdfMode={pdfMode}>
                    <EditableInput
                      className="fs-12"
                      placeholder="company Siret"
                      value={invoice.companySiretLabel}
                      onChange={(value) => handleChange('companySiretLabel', value)}
                      pdfMode={pdfMode}
                    />

                  </View>
                  <View className="ml-30" pdfMode={pdfMode}>
                  <EditableInput
                    className="fs-12"
                    placeholder="company Siret"
                    value={invoice.companySiret}
                    onChange={(value) => handleChange('companySiret', value)}
                    pdfMode={pdfMode}
                  />
                </View>
               </View>
               <View className="flex" pdfMode={pdfMode}>
                <View className="w-30" pdfMode={pdfMode}>
                    <EditableInput
                      className="fs-12"
                      placeholder="company Capital"
                      value={invoice.companyCapitalLabel}
                      onChange={(value) => handleChange('companyCapitalLabel', value)}
                      pdfMode={pdfMode}
                    />

                  </View>
                  <View className="ml-30" pdfMode={pdfMode}>
                  <EditableInput
                    className="fs-12"
                    placeholder="company Capital"
                    value={invoice.companyCapital}
                    onChange={(value) => handleChange('companyCapital', value)}
                    pdfMode={pdfMode}
                  />
                </View>
               </View>
          </View>


<View className="w-50 mt-100" pdfMode={pdfMode}>
      <View className="w-55" pdfMode={pdfMode}>
            <EditableInput
              className="bold fs-12  dark mb-5"
              value={invoice.billTo}
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-12 "
              placeholder="Your  Client's Name"
              value={invoice.clientName}
              onChange={(value) => handleChange('clientName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-12 "
              placeholder="Client's Address"
              value={invoice.clientAddress}
              onChange={(value) => handleChange('clientAddress', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-12 "
              placeholder="City, State Zip"
              value={invoice.clientAddress2}
              onChange={(value) => handleChange('clientAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
            className="fs-12 "
              options={countryList}
              value={invoice.clientCountry}
              onChange={(value) => handleChange('clientCountry', value)}
              pdfMode={pdfMode}
            />
          </View>
          </View>
        </View>

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-100" pdfMode={pdfMode}>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-100" pdfMode={pdfMode}>
                <EditableInput
                  placeholder="INV-12"
                  className="bold w-100"
                  value={query=='true'?'Avoir: ':'Devis: '+invoice.invoiceTitle}
                  pdfMode={true}
                />
              </View>
            </View>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-100" pdfMode={pdfMode}>
                <EditableCalendarInput
                 className="bold fs-12"
                  value={format(invoiceDate, dateFormat)}
                  selected={invoiceDate}
                  onChange={(date) =>
                    handleChange(
                      'invoiceDate',
                      date && !Array.isArray(date) ? format(date, dateFormat) : '',
                    )
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-dark flex" pdfMode={pdfMode}>
          <View className="w-20  p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold fs-12"
              value={invoice.productLineDescription}
              onChange={(value) => handleChange('productLineDescription', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold  fs-12 right"
              value={invoice.productLineQuantity}
              onChange={(value) => handleChange('productLineQuantity', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold  fs-12 right"
              value={invoice.productLineQuantityprice}
              onChange={(value) => handleChange('productLineQuantityprice', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold fs-12 right"
              value={invoice.taxLabel}
              onChange={(value) => handleChange('taxLabel', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold fs-12 right"
              value="Remise"
              onChange={(value) => handleChange('taxLabel', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-18 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white  fs-12 bold right"
              value={invoice.productLineQuantityAmount}
              onChange={(value) => handleChange('productLineQuantityAmount', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-18 center p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold  fs-12 right"
              value={invoice.productLineQuantityAmountTTC}
              onChange={(value) => handleChange('productLineQuantityAmountTTC', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>

        {invoice.productLines.map((productLine, i) => {
          return pdfMode && productLine.description === '' ? (
            <Text key={i}></Text>
          ) : (
            <View key={i} className="row flex" pdfMode={pdfMode}>
              <View className="w-20 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableTextarea
                  className="dark fs-12"
                  rows={2}
                  placeholder="Enter item name/description"
                  value={productLine.description}
                  onChange={(value) => handleProductLineChange(i, 'description', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark fs-12 right"
                  value={productLine.quantity || "1"}
                  onChange={(value) => handleProductLineChange(i, 'quantity', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark fs-12 right"
                  value={productLine.price || "0"}
                  onChange={(value) => handleProductLineChange(i, 'price', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark fs-12 right"
                  value={productLine.tva || "20"}
                  onChange={(value) => handleProductLineChange(i, 'tva', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark fs-12 right"
                  value={productLine.discount || "0"}
                  onChange={(value) => handleProductLineChange(i, 'discount', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
                <Text className="dark fs-12 right" pdfMode={pdfMode}>
                  {calculateAmount(productLine.quantity, productLine.price, productLine.discount)}
                </Text>
              </View>
              <View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
                <Text className="dark fs-12 right" pdfMode={pdfMode}>
                  {calculateAmountttc(productLine.quantity, productLine.price, productLine.tva ,productLine.discount)}
                </Text>
              </View>
              {!pdfMode && (
                <button
                  className="link row__remove"
                  aria-label="Remove Row"
                  title="Remove Row"
                  onClick={() => handleRemove(i)}
                >
                  <span className="icon icon-remove bg-red"></span>
                </button>
              )}
            </View>
          )
        })}


        <View className="flex" pdfMode={pdfMode}>
          <View className="w-50 mt-10" pdfMode={pdfMode}>
            {!pdfMode && (
              <button className="link" onClick={handleAdd}>
                <span className="icon icon-add bg-green mr-10"></span>
                Add Line Item
              </button>
            )}
            <View className="mt-20" pdfMode={pdfMode}>
               <EditableInput
                      className="dark fs-12"
                      value="Coordonnées bancaires :"
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
              <View className="flex" pdfMode={pdfMode}>
                <View className="w-25" pdfMode={pdfMode}>
                  <EditableInput
                  className="dark fs-12"
                      value="IBAN :"
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
                </View>
                <EditableInput
                      className="dark fs-12"
                      value={invoice.companyIBAN}
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
              </View>
              <View className="flex" pdfMode={pdfMode}>
                <View className="w-25" pdfMode={pdfMode}>
                  <EditableInput
                      className="dark fs-12"
                      value="BIC/SWIFT :"
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
                </View>
                <EditableInput
                      className="dark fs-12"
                      value={invoice.companyBICSWIFT}
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
              </View>
            </View>
          </View>
          <View className="w-50 mt-20" pdfMode={pdfMode}>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <EditableInput
                className="dark fs-12"
                  value={invoice.subTotalLabel}
                  onChange={(value) => handleChange('subTotalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <Text className="right fs-12 bold dark" pdfMode={pdfMode}>
                  {subTotal?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex bg-gray p-5" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="bold"
                  value={invoice.totalLabel}
                  onChange={(value) => handleChange('totalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50 p-5 flex" pdfMode={pdfMode}>
                <EditableInput
                  className="dark bold fs-12 right ml-30"
                  value={invoice.currency}
                  onChange={(value) => handleChange('currency', value)}
                  pdfMode={pdfMode}
                />
                <Text className=" bold dark w-auto" pdfMode={pdfMode}>
                  {(typeof subTotalTCC !== 'undefined' && typeof saleTax !== 'undefined'
                    ? subTotalTCC - saleTax
                    : 0
                  ).toFixed(2)}
                </Text>
               
              </View>
              
            </View>
          </View>
        </View>
        
        <View className="mt-20" pdfMode={pdfMode}>
          <EditableInput
            className="bold  fs-12 w-100"
            value={invoice.notesLabel}
            onChange={(value) => handleChange('notesLabel', value)}
            pdfMode={pdfMode}
          />
          <EditableTextarea
            className="w-100  fs-12"
            rows={2}
            value={invoice.conditionsBank || "Conditions"}
            onChange={(value) => handleChange('notes', value)}
            pdfMode={pdfMode}
          />
        </View>
        <View className="mt-20" pdfMode={pdfMode}>
          <EditableTextarea
            className="w-100 fs-terms"
            rows={2}
            value={invoice.notes || "note"}
            onChange={(value) => handleChange('term', value)}
            pdfMode={pdfMode}
          />
        </View>
      </Page>
    </Document>
  )
}

export default DevisPage
