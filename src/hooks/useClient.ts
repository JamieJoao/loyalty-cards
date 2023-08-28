import { useState } from 'react'
import { Unsubscribe } from 'firebase/auth'

import { useFirebase } from "./useFirebase"
import { ClientResponse } from '../types/ClientResponse'
import { useUser } from '../context/UserContext'
import { customerCollectionName } from '../domain/constants'

export const useClient = () => {
  const { getSnapshot, getSnapshotByLabel, updateDocument, addDocument } = useFirebase()
  const { setLoading } = useUser()
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [client, setClient] = useState<ClientResponse | null>(null)

  const getClients = (): Unsubscribe => {
    setLoading(true)
    const unsubscribe = getSnapshot<ClientResponse>(customerCollectionName, data => {
      setClients(data)
      setLoading(false)
    })

    return unsubscribe
  }

  const getClient = (id: string) => {
    setLoading(true)
    const unsubscribe = getSnapshotByLabel<ClientResponse>(
      customerCollectionName,
      { name: '__name__', value: id },
      data => {
        const [entryClient] = data

        setClient(entryClient)
        setLoading(false)
      })

    return unsubscribe
  }

  const updateClient = async (id: string, data: { [key: string]: string | boolean | number }) => {
    try {
      setLoading(true)
      await updateDocument(customerCollectionName, id, data)
      setLoading(false)
    } catch (error) {
      console.log(error, 'error in updateClient')
    }
  }

  const addPossibleCustomer = async () => {
    try {
      setLoading(true)
      const possibleCustomer = await addDocument(customerCollectionName, {})
      setLoading(false)

      return possibleCustomer?.id
    } catch (error) {
      console.log(error, 'error in addPossibleCustomer')
    }
  }

  return {
    clients,
    getClients,

    client,
    getClient,
    updateClient,
    addPossibleCustomer,
  }

}