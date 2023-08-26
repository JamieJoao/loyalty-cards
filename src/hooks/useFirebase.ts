import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from "../firebase/init"

export const useFirebase = () => {

  const getData = async <T>(table: string) => {
    const data: T[] = []
    const querySnapshot = await getDocs(collection(db, table))

    querySnapshot
      .forEach(doc => {
        data.push({ ...doc.data() as T, id: doc.id })
      })

    return data
  }

  const getSnapshot = <T>(table: string, callback: (data: T[]) => void) => {
    const unsubscribe = onSnapshot(collection(db, table), querySnapshot => {
      const data: T[] = []

      querySnapshot
        .forEach(doc => {
          data.push({ ...doc.data() as T, id: doc.id })
        })

      callback(data)
    })

    return unsubscribe
  }

  const getSnapshotByLabel = <T>(table: string, { name, value }: { name: string, value: unknown }, callback: (data: T[]) => void) => {
    const querySnapshot = query(collection(db, table), where(name, '==', value))
    const unsubscribe = onSnapshot(querySnapshot, q => {
      const data: T[] = []

      q
        .forEach(doc => {
          data.push({ ...doc.data() as T, id: doc.id })
        })

      callback(data)
    })

    return unsubscribe
  }

  const updateDocument = async (table: string, id: string, data: { [key: string]: string | boolean | number }) => {
    try {
      const document = doc(db, table, id)
      await updateDoc(document, data)
    } catch (error) {
      console.log([error])
    }
  }

  return {
    getData,
    getSnapshot,
    getSnapshotByLabel,
    updateDocument,
  }
}
