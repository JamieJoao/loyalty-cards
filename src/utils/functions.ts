import { CustomerPurchase } from "src/types/CustomerInterface"
import { PurchaseInterface, PurchaseProductsInterface } from "src/types/PurchaseInterface"

export const isLoggedUser = () => {
  return Boolean(localStorage.getItem('auth-token'))
}

export const getQuantityPurchases = (purchases: PurchaseInterface[] = []): number => (
  purchases.reduce((acc, curr) => {
    return curr.used ? acc : acc += 1
  }, 0)
)

export const filterValidPurchases = (purchases: PurchaseInterface[] = []): PurchaseInterface[] => (
  purchases.filter(obj => !obj.used)
)

export const cutNames = (fullname: string = ''): string => {
  const [firstName, _, secondName = ''] = fullname.split(' ')
  return `${firstName} ${secondName}`
}

export const getProductDetail = (productPurchased: PurchaseProductsInterface) => {
  const { quantity, product, price } = productPurchased
  return `${product.name} - s/ ${price.toFixed(2)} x ${quantity}`
}

export const getTotalByPurchase = (products: PurchaseProductsInterface[] = []) => (
  products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)
)
