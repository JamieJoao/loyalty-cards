import { DocumentReference } from "firebase/firestore"
import { CustomerInterface } from "./CustomerInterface"
import { CategoryInterface } from "./CategoryInterface"

export interface ProductInterface  {
  id: string
  name: string
  price: number
  // categoryId: string
  // category: DocumentReference<CategoryInterface>
  category: any
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

export interface PurchaseBackupInterface {
  date: string
  price: string
  product: string
}
