import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'

import { db } from "fire/init"
import { useUser } from 'src/context/UserContext'

export const useFirebase = () => {
  const { setLoading } = useUser()

  const getData = async <T>(table: string) => {
    setLoading(true)
    const data: T[] = []
    const querySnapshot = await getDocs(collection(db, table))
    setLoading(false)

    querySnapshot
      .forEach(doc => {
        data.push({ ...doc.data() as T, id: doc.id })
      })

    return data
  }

  const getDataByLabel = async <T>(table: string, { name, value }: { name: string, value: unknown }) => {
    const querySnapshot = query(collection(db, table), where(name, '==', value))
    const docs = await getDocs(querySnapshot)
    const data: T[] = []
    if (!docs.empty) {
      docs
        .forEach(doc => {
          data.push({ ...doc.data() as T, id: doc.id })
        })
    }

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
    const unsubscribe = onSnapshot(querySnapshot, docs => {
      const data: T[] = []

      docs
        .forEach(doc => {
          data.push({ ...doc.data() as T, id: doc.id })
        })

      callback(data)
    })

    return unsubscribe
  }

  const updateDocument = async (table: string, id: string, data: { [key: string]: string | boolean | number }) => {
    setLoading(true)
    try {
      const docRef = doc(db, table, id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.log([error])
    }
    setLoading(false)
  }

  const addDocument = async (table: string, data?: { [key: string]: unknown }) => {
    setLoading(true)
    try {
      const collectionRef = collection(db, table)
      return await addDoc(collectionRef, data)
    } catch (error) {
      console.log('Error in addDocument', error)
    }
    setLoading(false)
  }

  const deleteDocument = async (table: string, id: string) => {
    setLoading(true)
    try {
      const docRef = doc(db, table, id)
      return await deleteDoc(docRef)
    } catch (error) {
      console.log('Error in deleteDocument', error)
    }
    setLoading(false)
  }

  const getReference = (table: string, id: string) => {
    try {
      return doc(db, table, id)
    } catch (error) {
      console.log('Error in getReference', error)
    }
  }

  return {
    getData,
    getDataByLabel,
    getSnapshot,
    getSnapshotByLabel,
    getReference,
    updateDocument,
    addDocument,
    deleteDocument,
  }
}
