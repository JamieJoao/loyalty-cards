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
}

export type CustomerForm = {
  [key in keyof CustomerInterface]: string
}

export interface CustomerInput {
  key: keyof CustomerInterface
  label: string
  required: boolean
  placeholder?: string
  defaultValue: string
  values?: {
    label: string,
    value: string,
    props?: string[]
  }[]
  type: 'text' | 'select' | 'number' | 'date'
}
