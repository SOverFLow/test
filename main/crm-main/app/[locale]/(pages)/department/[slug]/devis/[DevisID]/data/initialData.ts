/******************************************************************************
 * @Author                : a-str-o<younes.elguer@gmail.com>                  *
 *                                                                            *
 *                                                                            *
 *****************************************************************************/

import { ProductLine, Invoice } from './types'

export const initialProductLine: ProductLine = {
  description: 'cleaning',
  quantity: '2',
  price: '50.00',
  tva:'20',
  discount: '0',
}

export const initialInvoice: Invoice = {
  id: '',
  logo: '',
  logoWidth: 100,
  title: 'CONVENTION SIMPLIFIEE DE FORMATION PROFESSIONNELLE',
  companyName: 'TEAMSHIFTS',
  name: '',
  companyAddress: 'GILIZ MARRAKECH',
  companyAddress2: '',
  companyCountry: 'United States',
  companyPhone:"+33 6 20 09 47 20",
  companyEmail: 'ak@votre-nettoyage.com',
  companyWebsite: 'https://votre-nettoyage.com/',
  companySiret: '78 530 555 800 013',
  companyCapital: '€ 100',
  companyCapitalLabel:'Capital :',
  companyIBAN: 'BE69 9675 3322 9978',
  companyBICSWIFT: 'TRWIBEB1XXX',
  companySiretLabel:"N° SIRET :",
  billTo: 'Facturer à:',
  clientName: 'YOUNES',
  clientAddress: 'GILIZ MARRAKECH',
  clientAddress2: 'CITY 40000',
  clientEmail: '',
  clientCountry: 'United States',
  invoiceTitleLabel: 'Invoice#',
  invoiceTitle: 'FACTURE N° 24-04-27',
  invoiceDateLabel: 'Invoice Date',
  invoiceDate: '',
  invoiceDueDateLabel: 'Due Date',
  invoiceDueDate: '',
  productLineDescription: 'Désignation',
  productLineQuantity: 'Quantite',
  productLineQuantityprice: 'PU Vente',
  productLineQuantityAmount: 'Montant HT',
  productLineQuantityAmountTTC: 'Montant TTC',
  productLines: [
    {
      description: 'Brochure Design',
      quantity: '2',
      price: '100.00',
      tva:'10',
      discount: '0',
    },
    { ...initialProductLine },
    { ...initialProductLine },
  ],
  subTotalLabel: 'Total HT',
  taxLabel: 'TVA',
  discount: '0',
  totalLabel: 'Total TTC',
  conditionsBank: 'Conditions de paiement :',
  currency: '',
  notesLabel: 'Conditions de paiement :',
  notes: '100,00% soit .....à payer le: .... (paiement comptant).',
  termLabel: 'Terms & Conditions',
  term: 'CLAUSE DE RÉSERVE DE PROPRIÉTÉ : Conformément à la loi 80.335 du 12 mai 1980, nous réservons la propriété des produits et marchandises, objets des présents débits, jusqu au paiement de l intégralité du prix et de ses accessoires. En cas de non paiementtotal ou partiel du prix del échéance pour quelquecause quecesoit, deconvention expresse, nous nousréservonslafaculté, sansformalités, dereprendre matériellement possession deces produits ou marchandisesàvosfrais, risqueset périls. Pénalité deretard : 3 foisletaux d intérêt légalaprès dateéchéance. Escompte pour règlementanticipé: 0% (sauf condition particulière définie danslesconditions derèglement) Le montant del indemnitéforfaitaire pour frais derecouvrement prévueen douzièmealinéa del articleL441-6 est fixéà 40 Eurosen matièrecommerciale',
}