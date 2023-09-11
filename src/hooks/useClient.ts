import { useState } from 'react'
import { Unsubscribe } from 'firebase/auth'

import { useFirebase } from "./useFirebase"
import { CustomerInterface } from 'types/CustomerInterface'
import { customerCollectionName } from 'domain/constants'
import { PurchaseInterface } from 'src/types/PurchaseInterface'

export const useClient = () => {
  const { getSnapshot, getSnapshotByLabel, updateDocument, addDocument, deleteDocument, getReference, getDataByLabel } = useFirebase()
  const [clients, setClients] = useState<CustomerInterface[]>([])
  const [client, setClient] = useState<CustomerInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getClients = (): Unsubscribe => {
    setLoading(true)

    const unsubscribe = getSnapshot<CustomerInterface>(customerCollectionName, async data => {
      const dataParsed = await Promise.all<Promise<any>>(
        data.map(async obj => {
          try {
            let dataPurchase = await getDataByLabel<PurchaseInterface>('purchases', {
              name: 'customer',
              value: getReference('customers', obj.id),
            })
            dataPurchase = dataPurchase.map(obj => ({ ...obj, date: obj.date.toDate() }))

            return {
              ...obj,
              purchases: dataPurchase.length ? dataPurchase : []
            }
          } catch (error) {
            console.log('Error en getClients al obtener la referencia de ' + obj.id, error)
            return { ...obj }
          }
        })
      )

      setClients(dataParsed)
      setLoading(false)

    })

    return unsubscribe
  }

  const getClient = (id: string, getRefs: boolean = true) => {
    setLoading(true)

    const unsubscribe = getSnapshotByLabel<CustomerInterface>(
      customerCollectionName,
      { name: '__name__', value: id },
      async data => {
        const [entryClient] = data
        let purchasesList: PurchaseInterface[] = []
        if (entryClient && getRefs) {
          const purchasesDirty = await getDataByLabel<PurchaseInterface>('purchases', {
            name: 'customer',
            value: getReference('customers', entryClient.id),
          })

          purchasesList = purchasesDirty.map(obj => ({ ...obj, date: obj.date.toDate() }))
        }

        setClient({ ...entryClient, purchases: purchasesList })
        setLoading(false)
      })

    return unsubscribe
  }

  const updateClient = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(customerCollectionName, id, data)
    } catch (error) {
      console.log(error, 'error in updateClient')
    }
  }

  const deleteClient = async (id: string) => {
    try {
      await deleteDocument(customerCollectionName, id)
    } catch (error) {
      console.log(error, 'error in deleteClient')
    }
  }

  const addPossibleCustomer = async <T>(data?: { [key in keyof T]: unknown }) => {
    try {
      const possibleCustomer = await addDocument(customerCollectionName, data)
      return possibleCustomer?.id
    } catch (error) {
      console.log(error, 'error in addPossibleCustomer')
    }
  }

  const getCustomerReference = (id: string) => {
    return getReference(customerCollectionName, id)
  }

  return {
    loading,
    clients,
    getClients,

    client,
    getClient,
    updateClient,
    deleteClient,
    addPossibleCustomer,

    getCustomerReference,
  }

}