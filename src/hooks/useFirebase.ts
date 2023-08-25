import { useState } from 'react'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

import { db } from "../firebase/init"
import { ClientResponse } from '../types/ClientResponse'

export const useFirebase = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    const data: ClientResponse[] = []
    const querySnapshot = await getDocs(collection(db, 'clients'))

    setLoading(true)
    setLoading(false)

    querySnapshot
      .forEach(doc => {
        data.push({ ...doc.data() as ClientResponse, id: doc.id })
      })

    return data
  }

  const getSnapshot = <T>(callback: (data: T[]) => void) => {
    setLoading(true)

    const unsubscribe =  onSnapshot(collection(db, 'clients'), querySnapshot => {
      const data: T[] = []

      setLoading(false)
      querySnapshot
        .forEach(doc => {
          data.push({ ...doc.data() as T, id: doc.id })
        })

      callback(data)
    })

    return unsubscribe
  }

  return {
    loading,
    getData,
    getSnapshot,
  }
}
