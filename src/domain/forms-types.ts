import { CustomerInterface } from "src/types/CustomerInterface"

export interface InputTypeForm {
  key: string
  label: string
}

export interface FieldCollection {
  id: string
  key: keyof CustomerInterface
  label: string
  placeholder: string
  required: boolean
  type: InputTypeForm
  options?: {
    key: string
    label?: string
  }[]
}

export interface FormCollection {
  id: string
  name: string
  submitText: string
  labels: FieldCollection[]
}
