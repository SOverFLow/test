/******************************************************************************
 * @Author                : a-str-o<younes.elguer@gmail.com>                  *
 *                                                                            *
 *                                                                            *
 *****************************************************************************/

import { CSSClasses } from '../data/types'

const colorDark = '#000'
const colorDark2 = '#000'
const colorGray = '#e3e3e3'
const colorWhite = '#fff'

const styles: CSSClasses = {
  dark: {
    color: colorDark,
  },

  white: {
    color: colorWhite,
  },

  'bg-dark': {
    backgroundColor: colorDark2,
  },

  'bg-gray': {
    backgroundColor: colorGray,
  },

  flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  'w-auto': {
    flex: 1,
    paddingRight: '8px',
  },

  'ml-30': {
    flex: 1,
  },
  'center' : {
    textAlign: 'center',
  },
  
  'w-100': {
    width: '100%',
  },

  'w-50': {
    width: '50%',
  },

  'w-55': {
    width: '55%',
  },

  'w-45': {
    width: '45%',
  },

  'w-60': {
    width: '60%',
  },

  'w-40': {
    width: '40%',
  },

  'w-48': {
    width: '48%',
  },

  'w-17': {
    width: '15%',
  },

  'w-18': {
    width: '18%',
  },
  'w-20': {
    width: '25%',
    maxWidth:'25%',
    },
  'w-30': {
    width: '35%',
  },
  row: {
    borderBottom: `1px solid ${colorGray}`,
  },

  'mt-40': {
    marginTop: '40px',
  },
  'mt-100': {
    marginTop: '100px',
  },

  'mt-30': {
    marginTop: '30px',
  },

  'mt-20': {
    marginTop: '20px',
  },

  'mt-10': {
    marginTop: '10px',
  },

  'mb-5': {
    marginBottom: '5px',
  },

  'p-4-8': {
    padding: '4px 8px',
  },

  'p-5': {
    padding: '5px',
  },

  'pb-10': {
    paddingBottom: '10px',
  },

  right: {
    textAlign: 'right',
  },

  bold: {
    fontWeight: 'bold',
  },

  'fs-20': {
    fontSize: '20px',
  },
  
  'fs-12': {
    fontSize: '8px',
  },
  
  'w-50-b' :{
    width: '50%',
    borderStyle: 'solid',
    borderRadius: '0px',
    borderWidth: '1px',
    borderColor: 'black',
    color:'black',
  }, 
  'w-16-b' :{
    width: '16.66%',
    borderStyle: 'solid',
    borderRadius: '0px',
    borderWidth: '1px',
    borderColor: 'black',
    color:'black',
  }, 
  'w-32-b' :{
    width: '33.32%',
    borderStyle: 'solid',
    borderRadius: '0px',
    borderWidth: '1px',
    borderColor: 'black',
    color:'black',
  },
  'w-66-b' :{
    width: '66.64%',
    borderStyle: 'solid',
    borderRadius: '0px',
    borderWidth: '1px',
    borderColor: 'black',
    color:'black',
  }, 
  
  'fs-17': {
    fontSize: '17px',
  },
  'fs-10': {
    fontSize: '8px',
  },
  'fs-45': {
    fontSize: '45px',
  },
  'fs-terms' : {
    fontSize: '5px',
  },
  
  page: {
    fontFamily: 'Helvetica-Bold',
    fontSize: '13px',
    color: '#555',
    padding: '40px 35px',
  },

  span: {
    padding: '4px 12px 4px 0',
  },

  logo: {
    display: 'block',
  },
}

export default styles