import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  addDoc,
} from 'firebase/firestore'

import { db } from "fire/init"

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
      const docRef = doc(db, table, id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.log([error])
    }
  }

  const addDocument = async (table: string, data?: { [key: string]: string | boolean | number }) => {
    try {
      const collectionRef = collection(db, table)
      return await addDoc(collectionRef, data)
    } catch (error) {
      console.log('Error in addDocument', error)
    }
  }

  return {
    getData,
    getSnapshot,
    getSnapshotByLabel,
    updateDocument,
    addDocument,
  }
}
