import { useState } from 'react'
import { Unsubscribe } from 'firebase/auth'

import { useFirebase } from "./useFirebase"
import { CustomerInterface } from 'types/CustomerInterface'
import { useUser } from 'context/UserContext'
import { customerCollectionName } from 'domain/constants'

export const useClient = () => {
  const { getSnapshot, getSnapshotByLabel, updateDocument, addDocument, deleteDocument } = useFirebase()
  const { loading, setLoading } = useUser()
  const [clients, setClients] = useState<CustomerInterface[]>([])
  const [client, setClient] = useState<CustomerInterface | null>(null)

  const getClients = (): Unsubscribe => {
    setLoading(true)
    const unsubscribe = getSnapshot<CustomerInterface>(customerCollectionName, data => {
      setClients(data)
      setLoading(false)
    })

    return unsubscribe
  }

  const getClient = (id: string) => {
    const unsubscribe = getSnapshotByLabel<CustomerInterface>(
      customerCollectionName,
      { name: '__name__', value: id },
      data => {
        const [entryClient] = data

        setClient(entryClient)
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

  const addPossibleCustomer = async (data?: { [key: string]: unknown }) => {
    try {
      setLoading(true)
      const possibleCustomer = await addDocument(customerCollectionName, data)
      setLoading(false)

      return possibleCustomer?.id
    } catch (error) {
      console.log(error, 'error in addPossibleCustomer')
    }
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
  }

}