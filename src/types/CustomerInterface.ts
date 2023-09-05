export interface CustomerPurchase {
  product: string
  price: string
  date?: string
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
  stage: number
  completeData: boolean
  purchases: CustomerPurchase[]
}

export type CustomerForm = {
  [key in keyof CustomerInterface]: any
}

export interface CustomerInput {
  key: keyof CustomerInterface
  label: string
  required: boolean
  placeholder?: string
  defaultValue: string
  icon: string
  values?: {
    label: string,
    value: string,
    props?: string[]
  }[]
  type: 'text' | 'select' | 'number' | 'date' | 'textarea'
}
