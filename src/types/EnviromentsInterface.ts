import { CustomerInput } from "./CustomerInterface"

export interface CardBack {
  gifts: number[]
  title: string
  subtitle: string
}

export interface Forms {
  registerUser: {
    buttonSubmit: string
    customerData: CustomerInput[]
  }
}

export interface Enviroments {
  clientsInformation: CustomerInput[]
  cardBack: CardBack
  forms: Forms
  id: string
}