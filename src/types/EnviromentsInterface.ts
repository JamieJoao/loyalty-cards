import { CustomerInput } from "./CustomerInterface"

export interface CardBack {
  gifts: number[]
  title: string
  subtitle: string
}

export interface FormTemplate {
  buttonSubmitText: string
  customerData: CustomerInput[]
  name: string
}

export interface Forms {
  [key: string]: FormTemplate
}

export interface Enviroments {
  // clientsInformation: CustomerInput[]
  linkShareMessage: string[]
  cardBack: CardBack
  forms: Forms
  id: string
}