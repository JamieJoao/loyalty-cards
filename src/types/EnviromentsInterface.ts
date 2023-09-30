import { FieldInput } from "./CustomerInterface"

export interface CardBack {
  gifts: number[]
  title: string
  subtitle: string
}

export interface FormTemplate {
  buttonSubmitText: string
  // customerData: FieldInput[]
  fields: FieldInput[]
  name: string
}

export interface Forms {
  [key: string]: FormTemplate
}

export interface Enviroments {
  // clientsInformation: FieldInput[]
  linkShareMessage: string[]
  cardBack: CardBack
  forms: Forms
  id: string
}