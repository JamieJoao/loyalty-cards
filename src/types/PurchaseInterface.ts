import { Timestamp } from "firebase/firestore"
import { CustomerInterface } from "./CustomerInterface"

export interface ProductInterface  {
  id: string
  name: string
  price: number
}

export interface PurchaseProductsInterface {
  quantity: number
  product: ProductInterface
  price: number
}

export interface PurchaseInterface {
  id: string
  customer: CustomerInterface
  names?: string
  phone?: number
  products: PurchaseProductsInterface[]
  date: any
  used: boolean
}