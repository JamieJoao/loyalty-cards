import { FormCollection } from "./forms-types"

export interface CardBack {
  gifts: number[]
  title: string
  subtitle: string
}

export interface EnviromentCollection {
  id: string
  cardBack: CardBack
  linkShareMessage: string[]
  forms: FormCollection[]
}