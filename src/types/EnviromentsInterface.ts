export interface CustomerInput {
  key: string
  label: string
  required: boolean
  defaultValue: string
  values?: {
    label: string,
    value: string,
    props?: string[]
  }[]
  type: 'text' | 'select' | 'number' | 'date'
}

export interface Enviroments {
  clientsInformation: CustomerInput[]
  gifts: number[]
  id: string
}