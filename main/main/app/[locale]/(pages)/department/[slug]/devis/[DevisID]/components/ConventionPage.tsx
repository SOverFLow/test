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
import { Font } from '@react-pdf/renderer'
import EditableInputMulty from './EditableInputMulty'
import { format } from 'date-fns'

Font.register({
  family: 'Nunito',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf',
      fontWeight: 600,
    },
  ],
})

interface Props {
  data?: Invoice
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

const ConventionPage: FC<Props> = ({ data, pdfMode, onChange }) => {
  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
  const [subTotal, setSubTotal] = useState<number>()
  const [saleTax, setSaleTax] = useState<number>()

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

  const calculateAmount = (quantity: string, rate: string) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

    return amount.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0

    invoice.productLines.forEach((productLine) => {
      const quantityNumber = parseFloat(productLine.quantity)
      const rateNumber = parseFloat(productLine.price)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

      subTotal += amount
    })

    setSubTotal(subTotal)
  }, [invoice.productLines])

  useEffect(() => {
    const match = invoice.taxLabel.match(/(\d+)%/)
    const taxRate = match ? parseFloat(match[1]) : 0
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.taxLabel])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper" pdfMode={pdfMode}>
         <View className="w-60" pdfMode={pdfMode}>
             <EditableInput
              className="bold dark mb-5"
              value= "Modèles Opcalia"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            <EditableCalendarInput
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
        <View className="w-100 mt-30 bg-dark p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold center w-100"
              // value={invoice.productLineDescription}
              value="Convention de formation tripartite"
              onChange={(value) => handleChange('productLineDescription', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="mt-20" pdfMode={pdfMode}>
            <EditableTextarea
              className="w-100"
              rows={2}
              value="Conclue en application des Articles L. 6353-2 et R. 6353-2 du Code du travail
              Informations générales
              Entre :"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
          </View>

      <View className="mt-20 flex" pdfMode={pdfMode}>
        <View className="w-55" pdfMode={pdfMode}>
          <EditableInput
              className="fs-20 bold"
              placeholder="L’entreprise"
              value="L’entreprise"
              onChange={(value) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Your Client's Name"
              value={invoice.clientName}
              onChange={(value) => handleChange('clientName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Client's Address"
              value={invoice.clientAddress}
              onChange={(value) => handleChange('clientAddress', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="City, State Zip"
              value={invoice.clientAddress2}
              onChange={(value) => handleChange('clientAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
              options={countryList}
              value={invoice.clientCountry}
              onChange={(value) => handleChange('clientCountry', value)}
              pdfMode={pdfMode}
            />
        </View>
          <View className="w-55" pdfMode={pdfMode}>
          <EditableInput
              className="fs-20 bold"
              placeholder="L’organisme de formation :"
              value="L’organisme de formation :"
              onChange={(value) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Your Client's Name"
              value={invoice.clientName}
              onChange={(value) => handleChange('clientName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Client's Address"
              value={invoice.clientAddress}
              onChange={(value) => handleChange('clientAddress', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="City, State Zip"
              value={invoice.clientAddress2}
              onChange={(value) => handleChange('clientAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
              options={countryList}
              value={invoice.clientCountry}
              onChange={(value) => handleChange('clientCountry', value)}
              pdfMode={pdfMode}
            />
          </View>
         
          </View>
          <View className="mt-20" pdfMode={pdfMode}>
            <EditableTextarea
              className="w-100"
              rows={1}
              value="Il est convenu ce qui suit :
              L’action de formation ci-après désignée est organisée suite à la demande du salarié et après
              accord de l’entreprise dans le cadre du Compte personnel de Formation (CPF) [ou] en dehors
              du temps de travail du salarié dans le cadre du plan de formation de l’entreprise (rayer les
              mentions inutiles) :
              Cette formation vise l’acquisition : ……………………. (indiquer le diplôme, le titre à finalité
              professionnelle ou le certificat de qualification professionnelle - CQP visé)"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />  
            <EditableInput
              className="bold dark mb-5"
              value= "Intitulé de l’action :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
                <EditableTextarea
              className="w-100"
              rows={2}
              value="L’action de formation réalisée dans le cadre de la présente convention entre dans l’une des
              catégories prévues aux Articles L. 6313-1 et L. 6314-1 du Code du travail (à cocher) :"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
            <EditableTextarea
              className="w-100"
              rows={1}
              value="- action d’adaptation et de développement des compétences des salariés."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
            <EditableTextarea
              className="w-100"
              rows={1}
              value="- actions de promotion de la mixité dans les entreprises, de sensibilisation à la lutte contre les
              stéréotypes sexistes et pour l’égalité professionnelle entre les femmes et les hommes."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
           <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de promotion professionnelle des travailleurs."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
             <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de prévention pour des salariés."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
             <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de conversion pour des salariés ou travailleurs non-salariés."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
             <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de qualification pour des travailleurs."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
             <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de formation relative à la radioprotection des professionnels exposés."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
           <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de lutte contre l’illettrisme et pour l’apprentissage de la langue française."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
              <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de formation relative à l’économie et à la gestion de l’entreprise pour des salariés."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
              <EditableTextarea
              className="w-100"
              rows={1}
              value="- action de formation relative à l’intéressement, à la participation et aux dispositifs d’épargne
              salariale et d’actionnariat salarié."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
              <EditableTextarea
              className="w-100"
              rows={1}
              value="- action d’accompagnement, d’information et de conseil dispensées aux créateurs ou
              repreneurs d’entreprises (agricoles, artisanales, commerciales ou libérales) exerçant ou non
              une activité."
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="mt-10 flex w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Objectifs :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..................................................................................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Effectif :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..................................................................................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Modalités de déroulement :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..................................................................................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Modalités de sanction :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..................................................................................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex w-100" pdfMode={pdfMode}>
        <View className="flex mt-10 w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Durée  :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..........................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex mt-10 w-100" pdfMode={pdfMode}>
            <View className="w-20" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Lieu, :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "............................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>
          <EditableInput
              className="dark mt-20"
              value= "Le programme détaillé de l’action de formation figure en annexe de la présente convention."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
        <View className="flex w-100" pdfMode={pdfMode}>
        <View className="flex mt-10 w-100" pdfMode={pdfMode}>
            <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Fait à, :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= "..........................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="flex mt-10 w-100" pdfMode={pdfMode}>
            <View className="w-20" pdfMode={pdfMode}>
            <EditableInput
              className="bold dark mb-5"
              value= "Le :"
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
            </View>
            <EditableInput
              className="dark mb-5"
              value= ".............................................."
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>

        <View className="flex mt-20 w-100" pdfMode={pdfMode}>
            <EditableTextarea
              className="w-100"
              rows={1}
              value="L’entreprise                            (cachet et signature)"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
            <EditableTextarea
              className="w-100"
              rows={1}
              value="L’organisme de formation                (cachet et signature)"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
            <EditableTextarea
              className="w-100"
              rows={1}
              value="Le salarié                              (signature)"
              onChange={(value) => handleChange('notes', value)}
              pdfMode={pdfMode}
            />
          </View>
      </Page>
    </Document>
  )
}

export default ConventionPage
