import { utils, writeFile } from 'xlsx'

import { PurchaseInterface } from "src/types/PurchaseInterface"
import { getProductDetail } from "./functions"

export const downloadPurchaseExcel = (purchases: PurchaseInterface[]) => {
  const jsonData = purchases
    .map(obj => {
      return ({
        id: obj.id,
        customer: obj.names,
        phone: obj.phone,
        products: obj
          .products
          .map(product => getProductDetail(product))
          .join('\n')
      })
    })

  const headers = {
    id: 'ID',
    customer: 'CLIENTE',
    phone: 'CELULAR',
    products: 'PRODUCTOS'
  }

  downloadExcel(jsonData, headers, 'ventas-diarias')
}

const downloadExcel = (data: { [key: string]: unknown }[], headers: { [key: string]: string }, filename: string) => {
  const headerKeys = Object.keys(headers)
  const headerValues = Object.values(headers)
  const jsonData = data.map(obj => headerKeys.map(key => obj[key]))
  const workSheet = utils.aoa_to_sheet([headerValues, ...jsonData])
  const workBook = utils.book_new()

  utils.book_append_sheet(workBook, workSheet, 'Ventas 1')
  writeFile(workBook, `${filename}.xlsx`)
}
