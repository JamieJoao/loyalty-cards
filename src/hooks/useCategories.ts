import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { CategoryInterface } from 'src/types/CategoryInterface'

const TABLE_NAME = 'categories'

export const useCategories = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getReference } = useFirebase()
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [category, setCategory] = useState<CategoryInterface | null>()
  const [loadingCategories, setLoading] = useState(false)

  const getCategories = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<CategoryInterface>(TABLE_NAME, data => {
        setCategories(data)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getCategories ')
    }
  }

  const getCategory = (id: string) => {
    const unsubscribe = getSnapshotByLabel<CategoryInterface>(
      TABLE_NAME,
      { name: '__name__', value: id },
      data => {
        const [entryCategory] = data
        setCategory(entryCategory)
      })

    return unsubscribe
  }

  const addCategory = async (data?: { [key: string]: any }) => {
    try {
      await addDocument(TABLE_NAME, data)
    } catch (error) {
      console.log('error en addCategory ')
    }
  }

  const updateCategory = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(TABLE_NAME, id, data)
    } catch (error) {
      console.log('error en updateCategory ')
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await deleteDocument(TABLE_NAME, id)
    } catch (error) {
      console.log('error en deleteCategory ')
    }
  }

  const getCategoryReference = (id: string) => {
    return getReference(TABLE_NAME, id)
  }

  return {
    categories,
    category,
    loadingCategories,

    getCategories,
    getCategory,
    getCategoryReference,

    addCategory,
    updateCategory,
    deleteCategory,
  }
}