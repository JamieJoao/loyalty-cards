import { CustomerPurchase } from "src/types/CustomerInterface"

export const isLoggedUser = () => {
  return Boolean(localStorage.getItem('auth-token'))
}

export const getQuantityPurchases = (purchases: CustomerPurchase[] = []): number => (
  purchases.reduce((acc, curr) => {
    return curr.used ? acc : acc += 1
  }, 0)
)

export const filterValidPurchases = (purchases: CustomerPurchase[] = []): CustomerPurchase[] => (
  purchases.filter(obj => !obj.used)
)

export const cutNames = (fullname: string = ''): string => {
  const [firstName, _, secondName = ''] = fullname.split(' ')

  return `${firstName} ${secondName}`
}
