import { CustomerInput } from "./CustomerInterface"

export interface CardBack {
  gifts: number[]
  title: string
  subtitle: string
}

export interface Enviroments {
  clientsInformation: CustomerInput[]
  cardBack: CardBack
  id: string
}