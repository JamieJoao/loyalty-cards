import { useState } from 'react'
import { Unsubscribe } from 'firebase/auth'

import { useFirebase } from "./useFirebase"
import { ClientResponse } from '../types/ClientResponse'

export const useClient = () => {
  const { getSnapshot, getSnapshotByLabel, updateDocument } = useFirebase()
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [client, setClient] = useState<ClientResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getClients = (): Unsubscribe => {
    setLoading(true)
    const unsubscribe = getSnapshot<ClientResponse>('clients', data => {
      setClients(data)
      setLoading(false)
    })

    return unsubscribe
  }

  const getClient = (id: string) => {
    setLoading(true)
    const unsubscribe = getSnapshotByLabel<ClientResponse>(
      'clients',
      { name: '__name__', value: id },
      data => {
        const [entryClient] = data

        setClient(entryClient)
        setLoading(false)
      })

    return unsubscribe
  }

  const updateClient = async (id: string, data: { [key: string]: string | boolean | number }) => {
    setLoading(true)
    await updateDocument('clients', id, data)
    setLoading(false)
  }

  return {
    loading,
    clients,
    getClients,

    client,
    getClient,
    updateClient,
  }

}