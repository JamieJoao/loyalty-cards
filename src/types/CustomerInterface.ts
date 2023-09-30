import { PurchaseBackupInterface, PurchaseInterface } from "./PurchaseInterface"

export interface CustomerPurchase {
  product: string
  price: string
  date?: string
  used?: boolean
}

export interface CustomerInterface {
  id: string
  sex: string
  birthdayDate: Date
  occupation: string
  phone: number
  address: string
  dni: number
  names: string
  completeData: boolean
  purchases: PurchaseInterface[]
  purchasesBackup: PurchaseBackupInterface[]
}

export type CustomerForm = {
  [key in keyof CustomerInterface]: any
}

export type InputTypes = 'text' | 'select' | 'number' | 'date' | 'textarea'
export type InputLabelTypes = 'Texto' | 'Opciones' | 'Número' | 'Fecha' | 'Texto Grande'

export interface FieldInput {
  key: keyof CustomerInterface
  label: string
  required: boolean
  placeholder?: string
  options?: {
    key: string,
    label?: string,
    props?: string[]
  }[]
  type: {
    key: InputTypes
    label: InputLabelTypes
  }
}
