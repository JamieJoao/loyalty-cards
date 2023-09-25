import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { ProductInterface, PurchaseInterface } from 'src/types/PurchaseInterface'

const TABLE_NAME = 'purchases'

export const usePurchase = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getReference } = useFirebase()
  const [purchases, setPurchases] = useState<PurchaseInterface[]>([])
  const [purchase, setPurchase] = useState<PurchaseInterface | null>()
  const [loadingPurchases, setLoading] = useState(false)

  const getPurchases = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<PurchaseInterface>(TABLE_NAME, data => {
        const dataTransformed = data?.map(obj => ({ ...obj, date: obj.date.toDate() })) ?? []

        setPurchases(dataTransformed)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getPurchases ')
    }
  }

  const getPurchase = (id: string) => {
    const unsubscribe = getSnapshotByLabel<PurchaseInterface>(
      TABLE_NAME,
      { name: '__name__', value: id },
      data => {
        const [entryData] = data
        setPurchase(entryData)
      })

    return unsubscribe
  }

  const addPurchase = async (data?: { [key: string]: any }) => {
    try {
      await addDocument(TABLE_NAME, data)
    } catch (error) {
      console.log('error en addPurchase ')
    }
  }

  const updatePurchase = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(TABLE_NAME, id, data)
    } catch (error) {
      console.log('error en updatePurchase ')
    }
  }

  const deletePurchase = async (id: string) => {
    try {
      await deleteDocument(TABLE_NAME, id)
    } catch (error) {
      console.log('error en deletePurchase ')
    }
  }

  const getPurchasesByCustomer = (customerId: string) => {
    setLoading(true)
    const unsubscribe = getSnapshotByLabel<PurchaseInterface>(
      TABLE_NAME,
      { name: 'customer', value: getReference('customers', customerId) },
      data => {
        setPurchases(data.map(obj => ({ ...obj, date: obj.date.toDate() })))
        setLoading(false)
      })

    return unsubscribe
  }

  return {
    purchases,
    purchase,
    loadingPurchases,

    getPurchases,
    getPurchase,
    getPurchasesByCustomer,

    addPurchase,
    updatePurchase,
    deletePurchase,
  }
}